import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Student } from './models/student';
import dotenv from 'dotenv';
import { Users } from './models/user';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  ssl: { rejectUnauthorized: false },
  migrations: [],
  url: process.env.DB_URL,
  // username: process.env.DB_USER,
  // database: process.env.DB_DATABASE,
  // password: process.env.DB_PASSWD,
  // host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: [Student, Users],
  synchronize: true,
  logging: false
});

AppDataSource.initialize()
  .then(() => {
    console.log('connected..');
  })
  .catch((error) => {
    console.error(error, 'unable to connect..');
  });
export default AppDataSource;
