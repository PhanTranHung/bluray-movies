import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { dynamodbConfig } from './config';

@Module({
  imports: [DynamooseModule.forRoot(dynamodbConfig)],
})
export class DynamodbModule {}
