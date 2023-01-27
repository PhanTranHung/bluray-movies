import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { realtionalDatabaseConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(realtionalDatabaseConfig)],
})
export class RealtionalDatabaseModule {
  constructor(private dataSource: DataSource) {}
}
