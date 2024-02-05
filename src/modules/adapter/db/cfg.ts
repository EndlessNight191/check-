import { DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  synchronize: true,
  logging: true,
}; // сделать нормальный модуль конфига

export default dataSourceOptions;
