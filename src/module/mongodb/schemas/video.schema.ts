import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({
  collection: 'videos',
})
export class Video {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: 'original' })
  quality: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
