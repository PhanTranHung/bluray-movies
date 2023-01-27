import { DataSource } from 'typeorm';
import { dataSourceConfig } from './config';

export default new DataSource(dataSourceConfig);
