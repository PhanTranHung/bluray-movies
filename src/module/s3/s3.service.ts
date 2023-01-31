import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { commonLogger } from 'src/common/logger.common';

const region = process.env.S3_REGION;

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  public async signedUrl(key: string, folder?: string) {
    // TODO: check is valid key & folder

    const inputParam: PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET,
      Key: `${folder ? folder + '/' : ''}${nanoid(12)}-${key}`,
      ContentType: '*/*',
    };

    try {
      const putObjectCommand = new PutObjectCommand(inputParam);

      const signedUrl = await getSignedUrl(this.s3Client, putObjectCommand, { expiresIn: 3600 });

      return {
        signedUrl,
        endpoint: `https://${inputParam.Bucket}.s3.${region}.amazonaws.com/${inputParam.Key}`,
      };
    } catch (error) {
      commonLogger.log('ERROR', 'CANNOT_CREATE_SIGNED_URL');
      throw error;
    }
  }

  public async upload(name: string, body: PutObjectCommandInput['Body']) {
    try {
      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${nanoid(12)}-${name}`,
        Body: body,
      });

      const data = await this.s3Client.send(putObjectCommand);
      console.table(data);
    } catch (error) {
      commonLogger.log('ERROR', 'CANNOT_UPLOAD_DATA_TO_S3_BUCKET');
      throw error;
    }
  }
}
