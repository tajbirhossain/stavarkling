import { enterNextPanel } from '@/lib/accessPanelStage'
import { getAccessSession } from '@/lib/accessSession'
import { accessPathForStage } from '@/lib/requireAccessStage'
import { isStoredAccessStage } from '@/lib/accessStages'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      fromStage?: unknown
    } | null
    const fromStage = isStoredAccessStage(body?.fromStage)
      ? body.fromStage
      : undefined

    const result = await enterNextPanel(session.applicationId, fromStage)

    if (!result.ok) {
      if (result.reason === 'not_found') {
        return NextResponse.json({ error: 'Not found.' }, { status: 404 })
      }
      return NextResponse.json(
        {
          error: 'The next stage is not available yet.',
          accessStage: session.accessStage,
          panelStage: session.panelStage,
          path: accessPathForStage(session.panelStage),
        },
        { status: 409 }
      )
    }

    return NextResponse.json({
      panelStage: result.panelStage,
      accessStage: result.accessStage,
      path: result.path,
    })
  } catch (err) {
    console.error('enter next panel failed', err)
    return NextResponse.json(
      { error: 'Unable to continue right now. Please try again.' },
      { status: 503 }
    )
  }
}
