import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { Context, S3Event, S3EventRecord } from 'aws-lambda';
import * as child_process from 'child_process';
import dayjs from 'dayjs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import internal from 'stream';

const ALLOWED_RESOLUTIONS = ['360', '720'] as const; // 1080
const outputDir = path.join(os.tmpdir());
const DEBUG = true;

const debug = (...data: any[]) => {
  DEBUG && console.log(data);
};

type AllowedResolution = typeof ALLOWED_RESOLUTIONS[number];
type VideoInfo = { path: string; name: string; resolution: AllowedResolution };
type TransformStatus = {
  record: S3EventRecord;
  status: boolean;
  message?: string;
  resolution?: AllowedResolution;
  error?: any;
};

const excuteCommand = (command: string, args: string[], options?: child_process.SpawnOptionsWithoutStdio) => {
  return new Promise((resolve, reject) => {
    const subProcess = child_process.spawn(command, args, options).on('close', (code, signal) => {
      console.log(`[${command}] process exited with code ${code}, signal ${signal}`);
      if (code !== 0) return reject(code);
      return resolve(code);
    });

    subProcess.stdout.on('data', (msg) =>
      debug(`[stdout][${command}]: ${dayjs().format('YYYY-MM-DD HH:mm:ss ')} ${msg}`),
    );
    subProcess.stderr.on('data', (error) =>
      console.log(`[stderr][${command}]: ${dayjs().format('YYYY-MM-DD HH:mm:ss ')} ${error}`),
    );
  });
};

const getS3Client = (region: string) => new S3Client({ region });

const downloadFromS3 = async (s3Record: S3EventRecord) => {
  const s3Client = getS3Client(s3Record.awsRegion);
  const s3 = s3Record.s3;

  const getObjectCommand = new GetObjectCommand({
    Bucket: s3.bucket.name,
    Key: s3.object.key,
  });

  const item = await s3Client.send(getObjectCommand);

  return new Promise<{ savedPath: string }>((resolve, reject) => {
    if (item.Body instanceof internal.Readable) {
      const savedPath = path.join(outputDir, s3.object.key);
      item.Body.pipe(fs.createWriteStream(savedPath))
        .on('error', (err) => reject(err))
        .on('close', () => resolve({ savedPath }));
    } else
      reject(
        'Dowload error. GetObjectCommand should return an internal.Readable object. Maybe the code is running in the Browser?',
      );
  });
};

const uploadToS3 = async (putObjectInput: PutObjectCommandInput, s3Client: S3Client) => {
  const command = new PutObjectCommand(putObjectInput);

  return s3Client.send(command);
};

const generateOutputName = ({
  filePath,
  resolution,
}: {
  filePath: string;
  resolution: typeof ALLOWED_RESOLUTIONS[number];
}) => {
  const parsePath = path.parse(filePath);
  return `${parsePath.name}-${resolution}${parsePath.ext}`;
};

const transformVideo = async (
  videoPath: string,
  config: {
    resolution: typeof ALLOWED_RESOLUTIONS[number];
    outputName?: string;
  },
): Promise<VideoInfo> => {
  if (!ALLOWED_RESOLUTIONS.includes(config.resolution)) throw new Error('Invalid resolution');
  // if (isSubArray(config.resolutions, ALLOWED_RESOLUTION)) throw new Error('Invalid resolution');

  const outputName = config.outputName || generateOutputName({ filePath: videoPath, resolution: config.resolution });
  const outputPath = path.join(outputDir, outputName);
  console.log('fileOutputName', outputPath);

  const args = [
    '-y',
    '-i',
    videoPath,
    '-vf',
    `scale=-2:${config.resolution}`,
    '-c:v',
    'libx264',
    '-crf',
    '18',
    '-preset',
    'veryslow',
    '-c:a',
    'copy',
    outputPath,
  ];

  return excuteCommand('/opt/bin/ffmpeg', args)
    .then(() => ({
      path: outputPath,
      name: outputName,
      resolution: config.resolution,
    }))
    .catch(() => {
      throw new Error(`Tranform error. Command "/opt/bin/ffmpeg ${args.join(' ')}"`);
    });
};

const uploadTransformedVideo = (videoInfo: VideoInfo, s3Record: S3EventRecord) => {
  const s3Client = getS3Client(s3Record.awsRegion);
  const { key } = s3Record.s3.object;
  const { name, path: filePath, resolution } = videoInfo;

  const newKey = `${path.dirname(key)}/${resolution}/${name}`;
  return uploadToS3({ Bucket: s3Record.s3.bucket.name, Key: newKey, Body: filePath }, s3Client);
};

const handleTranformVideo = async (s3EventRecord: S3EventRecord): Promise<TransformStatus[]> => {
  const transformStatus: TransformStatus[] = [];

  let downloadedInfo: Awaited<ReturnType<typeof downloadFromS3>>;

  try {
    downloadedInfo = await downloadFromS3(s3EventRecord);
  } catch (error) {
    return [{ record: s3EventRecord, status: false, error }];
  }

  for (const resolution of ALLOWED_RESOLUTIONS) {
    try {
      const transformedInfo = await transformVideo(downloadedInfo.savedPath, { resolution });
      await excuteCommand('ls', ['-a', outputDir]);
      const putObjectOutput = await uploadTransformedVideo(transformedInfo, s3EventRecord);
      console.log(`Upload Result: ${JSON.stringify(putObjectOutput, null, 2)}`);
      await excuteCommand('rm', [transformedInfo.path]);
      transformStatus.push({ record: s3EventRecord, status: true, message: 'Successful' });
    } catch (error) {
      transformStatus.push({ record: s3EventRecord, status: false, error, resolution });
    }
  }

  return transformStatus;
};

export const handler = async (event: S3Event, context: Context) => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  await excuteCommand('ls', ['-a', outputDir]);
  const transformResult: TransformStatus[][] = [];

  for (const record of event.Records) {
    transformResult.push(await handleTranformVideo(record));
  }

  console.log('Processing complete successfully');
  console.log(JSON.stringify(transformResult, null, 2));

  return {
    statusCode: 200,
    body: 'Processing complete successfully',
    info: transformResult,
  };
};

// =================== TEST CODE ===========================
// const handleTransform = async (s3Record: S3EventRecord, s3Client: S3Client) => {
//   const ffmpegCommand = '/opt/bin/ffmpeg';
//   const args = [
//     '-f',
//     // path.extname(s3Record.s3.object.key).toLowerCase(),
//     'mp4',
//     '-i',
//     'pipe:',
//     '-vf',
//     `scale=-2:1080`,
//     '-c:v',
//     'libx264',
//     '-crf',
//     '18',
//     '-preset',
//     'veryslow',
//     '-c:a',
//     'copy',
//     '-f',
//     'mp4',
//     path.join(outputDir, 'output.mp4'),
//   ];

//   return new Promise(async (resolve, reject) => {
//     const s3 = s3Record.s3;

//     const getObjectCommand = new GetObjectCommand({
//       Bucket: s3.bucket.name,
//       Key: s3.object.key,
//     });

//     const item = (await s3Client.send(getObjectCommand)) as GetObjectOutput;

//     if (item.Body instanceof Readable) {
//       const subProcess = child_process.spawn(ffmpegCommand, args).on('close', (code, signal) => {
//         console.log(`[${getObjectCommand}] process exited with code ${code}, signal ${signal}`);
//         if (code !== 0) return reject(code);
//         return resolve(code);
//       });
//       subProcess.stdout.on('data', (msg) =>
//         console.log(`[OUT_DATA]: ${dayjs().format('YYYY-MM-DD HH:mm:ss   \n')} ${msg}`),
//       );
//       subProcess.stderr.on('data', (error) =>
//         console.log(`[ERROR]: ${dayjs().format('YYYY-MM-DD HH:mm:ss   \n')} ${error}`),
//       );
//       item.Body.pipe(subProcess.stdin);
//     } else {
//       throw new Error('Unknown object stream type.');
//     }

//     // const putObjectCommand = new PutObjectCommand({
//     //   Bucket: s3.bucket.name,
//     //   Key: s3.object.key,
//     // });

//     // const putItem = await s3Client.send(putObjectCommand);
//   });
// };

// const getPresignedViewUrl = async (s3Record: S3EventRecord, s3Client: S3Client) => {
//   const s3 = s3Record.s3;

//   const command = new GetObjectCommand({
//     Bucket: s3.bucket.name,
//     Key: s3.object.key,
//   });

//   // Create the presigned URL.
//   const signedUrl = await getSignedUrl(s3Client, command, {
//     expiresIn: 60 * 15, // 15 minutes
//   });
//   console.log('signed-view-url', signedUrl);
//   return signedUrl;
// };

// const isSubArray = <T>(sub: T[], parent: T[]) => {
//   return sub.every((i) => parent.includes(i));
// };
