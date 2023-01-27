import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtionalDatabaseModule } from './module/relational-database/relational-database.module';
import { V1Module } from './module/v1/v1.module';

@Module({
  imports: [RealtionalDatabaseModule, V1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
