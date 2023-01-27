import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtionalDatabaseModule } from './module/relational-database/relational-database.module';

@Module({
  imports: [RealtionalDatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
