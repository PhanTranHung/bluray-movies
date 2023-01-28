import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongodbConfigs } from './mongodb.config';

@Module({
  imports: [MongooseModule.forRoot(mongodbConfigs.connection, mongodbConfigs.options)],
})
export class MongodbModule {}
