import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET() {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL)
  const databaseConnected = hasDatabaseUrl
    ? await checkDatabaseConnection()
    : false

  const status = databaseConnected ? 'ok' : 'degraded'

  return NextResponse.json(
    {
      status,
      service: 'stavarkling',
      database: databaseConnected
        ? 'connected'
        : hasDatabaseUrl
          ? 'unreachable'
          : 'not_configured',
      timestamp: new Date().toISOString(),
    },
    { status: databaseConnected ? 200 : 503 }
  )
}
