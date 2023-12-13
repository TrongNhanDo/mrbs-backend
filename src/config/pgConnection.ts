import { Client } from 'pg';

const pgConnection = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '123123',
  database: 'mrbs',
});

export default pgConnection;
