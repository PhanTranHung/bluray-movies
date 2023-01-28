import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { VideoKey, VideoMeta, VideoObject } from 'src/module/dynamodb/schemas/video/video.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(VideoMeta.name)
    private videoModel: Model<VideoKey, VideoObject>,
  ) {}

  createVideo(video: VideoObject) {
    return this.videoModel.create(video);
  }
}
