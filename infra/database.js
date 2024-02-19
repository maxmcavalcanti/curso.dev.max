import { Client, Pool } from "pg";

async function query(queryObject) {
  const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  };

  const client = new Client(config);

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    client.end();
  }
}

export default {
  query: query,
};
