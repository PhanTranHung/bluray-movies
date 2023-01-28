import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadVideoDto } from './dto/upload-video.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/')
  uploadVideo(@Body() videoData: UploadVideoDto) {
    return this.uploadService.createVideo(videoData);
  }
}
