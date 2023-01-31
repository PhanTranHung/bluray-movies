import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { realtionalDatabaseConfig } from './relational-database.config';

@Module({
  imports: [TypeOrmModule.forRoot(realtionalDatabaseConfig)],
})
export class RealtionalDatabaseModule {
  constructor(private dataSource: DataSource) {}
}
