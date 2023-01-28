import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { VideoMeta, VideoSchema } from 'src/module/dynamodb/schemas/video/video.schema';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [DynamooseModule.forFeature([{ name: VideoMeta.name, schema: VideoSchema }])],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
