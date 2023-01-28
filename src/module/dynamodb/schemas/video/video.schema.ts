import { Schema } from 'dynamoose';

export const VideoMeta = {
  name: 'Video',
};

export const VideoSchema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
    },
    name: {
      type: String,
    },
    url: {
      type: String,
    },
    quality: {
      type: String,
    },
  },
  {
    saveUnknown: true,
    timestamps: true,
  },
);

export interface VideoKey {
  id: string;
}

export interface VideoObject extends VideoKey {
  name: string;
  url: string;
  quality: string;
}
