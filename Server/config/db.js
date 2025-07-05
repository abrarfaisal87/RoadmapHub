import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const {
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_PORT,
  PG_DATABASE
} = process.env;

const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT,
    ssl:{
        rejectUnauthorized: false // This is important for self-signed certificates
    }
});

export default pool;