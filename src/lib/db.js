import { Pool } from "pg";

let pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (connectionString) {
      pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      pool = new Pool({
        host: process.env.POSTGRES_HOST || process.env.PGHOST || "localhost",
        port: Number(process.env.POSTGRES_PORT || process.env.PGPORT || 5432),
        user: process.env.POSTGRES_USER || process.env.PGUSER || "postgres",
        password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || "",
        database: process.env.POSTGRES_DATABASE || process.env.PGDATABASE || "postgres",
        ssl: process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : false,
      });
    }
  }

  return pool;
}

export function convertNamedParams(sql, params = {}) {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return { text: sql, values: params || [] };
  }

  const paramKeys = [];
  const text = sql.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      let index = paramKeys.indexOf(key);
      if (index === -1) {
        paramKeys.push(key);
        index = paramKeys.length - 1;
      }
      return `$${index + 1}`;
    }
    return match;
  });

  const values = paramKeys.map((key) => params[key]);
  return { text, values };
}

export async function query(sql, params = {}) {
  let { text, values } = convertNamedParams(sql, params);

  // If query is an INSERT and does not contain RETURNING clause, append RETURNING id
  const isInsert = /^\s*INSERT\s+INTO/i.test(text);
  if (isInsert && !/RETURNING/i.test(text)) {
    text += " RETURNING id";
  }

  const res = await getPool().query(text, values);
  const rows = res.rows || [];

  if (isInsert && rows.length > 0 && rows[0].id !== undefined) {
    rows.insertId = rows[0].id;
  }

  return rows;
}
