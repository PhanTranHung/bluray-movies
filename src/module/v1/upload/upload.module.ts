import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from 'src/module/mongodb/schemas/video.schema';
import { S3Module } from 'src/module/s3/s3.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]), S3Module],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
