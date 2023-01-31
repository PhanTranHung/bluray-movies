import { DataSource } from 'typeorm';
import { dataSourceConfig } from './relational-database.config';

export default new DataSource(dataSourceConfig);
