import { enterNextPanel } from '@/lib/accessPanelStage'
import { getAccessSession } from '@/lib/accessSession'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  const session = await getAccessSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const result = await enterNextPanel(session.applicationId)

    if (!result.ok) {
      if (result.reason === 'not_found') {
        return NextResponse.json({ error: 'Not found.' }, { status: 404 })
      }
      return NextResponse.json(
        {
          error: 'The next stage is not available yet.',
          accessStage: session.accessStage,
          panelStage: session.panelStage,
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
