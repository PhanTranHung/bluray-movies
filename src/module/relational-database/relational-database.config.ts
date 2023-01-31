import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

// TODO: Move this config to env file
export const dataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'bluray-movies.cnlvd2eru6yh.ap-southeast-1.rds.amazonaws.com',
  port: 3306,
  username: 'admin',
  password: '123456789',
  database: 'bluray_movies',
  // TODO: Path to entities folder doesn't work. Fix this and remove autoLoadEntities option.
  entities: [`${__dirname}/entities/**/*.entity.ts`],
  migrations: [`${__dirname}/migrations/**/*.ts`],
};

export const realtionalDatabaseConfig: TypeOrmModuleOptions = {
  ...dataSourceConfig,
  synchronize: false,
  autoLoadEntities: true,
};
