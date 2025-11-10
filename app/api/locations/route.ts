import { NextResponse } from 'next/server'

import { getLocationsData } from '@/lib/server/game-engine'

export async function GET() {
  try {
    return NextResponse.json(getLocationsData())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load locations'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

