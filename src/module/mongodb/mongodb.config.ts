import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongodbConfigs: {
  connection: string;
  options: MongooseModuleOptions;
} = {
  connection: process.env.MDB_CONNECTION,
  options: {},
};
