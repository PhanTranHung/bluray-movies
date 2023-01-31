import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { S3Service } from 'src/module/s3/s3.service';
import { GetSignedUrlDto } from './dto/get-signed-url.dto';
import { UploadVideoDto } from './dto/upload-video.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService, private readonly s3Service: S3Service) {}

  @Post('/')
  uploadVideo(@Body() videoData: UploadVideoDto) {
    return this.uploadService.createVideo(videoData);
  }

  @Get('get-signed-url')
  getSignedUrl(@Query() data: GetSignedUrlDto) {
    return this.s3Service.signedUrl(data.file_name, data.folder);
  }
}
