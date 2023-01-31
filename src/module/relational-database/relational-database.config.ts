import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.RDB_HOST,
  port: +process.env.RDB_PORT,
  username: process.env.RDB_USERNAME,
  password: process.env.RDB_PASSWORD,
  database: process.env.RDB_NAME,
  // TODO: Path to entities folder doesn't work. Fix this and remove autoLoadEntities option.
  entities: [`${__dirname}/entities/**/*.entity.ts`],
  migrations: [`${__dirname}/migrations/**/*.ts`],
};

export const realtionalDatabaseConfig: TypeOrmModuleOptions = {
  ...dataSourceConfig,
  synchronize: false,
  autoLoadEntities: true,
};
