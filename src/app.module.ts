import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamodbModule } from './module/dynamodb/dynamodb.module';
import { MongodbModule } from './module/mongodb/mongodb.module';
import { RealtionalDatabaseModule } from './module/relational-database/relational-database.module';
import { V1Module } from './module/v1/v1.module';

@Module({
  imports: [RealtionalDatabaseModule, DynamodbModule, MongodbModule, V1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
