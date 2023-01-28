import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from 'src/module/mongodb/schemas/video.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Video.name)
    private videoModel: Model<VideoDocument>,
  ) {}

  createVideo(video: Video) {
    return this.videoModel.create(video);
  }
}
