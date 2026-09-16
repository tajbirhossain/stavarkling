import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg'

const globalForDb = globalThis as typeof globalThis & {
  pgPool?: Pool
}

/**
 * Keep the pool small: Next.js can spawn multiple workers/instances.
 * Prefer Supabase transaction pooler (port 6543) in DATABASE_URL.
 */
function createPool() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env.local and add your Supabase Postgres URI.'
    )
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    allowExitOnIdle: true,
  })
}

export function getPool() {
  if (!globalForDb.pgPool) {
    globalForDb.pgPool = createPool()
  }

  return globalForDb.pgPool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  // Pool.query borrows and releases a client automatically.
  return getPool().query<T>(text, params)
}

/**
 * Borrow a client for multi-statement work. Always releases, even on error,
 * so we never leak connections and exhaust the pool.
 */
export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query('SET statement_timeout = 8000')
    return await fn(client)
  } finally {
    client.release()
  }
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  return withClient(async (client) => {
    await client.query('BEGIN')
    try {
      const result = await fn(client)
      await client.query('COMMIT')
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  })
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch {
    return false
  }
}
