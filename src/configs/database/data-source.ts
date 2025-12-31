import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

const isDev = process.env.NODE_ENV !== 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: isDev
    ? [join(__dirname, '..', '**', '*.entity.{ts,js}')] // src/**/*.entity.ts
    : [join(__dirname, '..', '**', '*.entity.{js}')], // dist/**/*.entity.js

  migrations: isDev
    ? [join(__dirname, 'migrations', '*.{ts,js}')]
    : [join(__dirname, 'migrations', '*.js')],

  synchronize: isDev ? true : false,
  logging: false,
});
