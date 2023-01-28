import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { nanoid } from 'nanoid';
import { VideoObject } from 'src/module/dynamodb/schemas/video/video.schema';

export class CreateVideoDto implements VideoObject {
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quality: string;

  constructor() {
    this.id = nanoid();
  }
}
