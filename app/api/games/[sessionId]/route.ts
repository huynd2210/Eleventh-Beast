import { NextResponse } from 'next/server'

import {
  deleteGameSession,
  getGameSession,
  type GameResponse,
} from '@/lib/server/game-engine'

type ParamsPromise = Promise<{ sessionId: string }>

export async function GET(_: Request, context: { params: ParamsPromise }) {
  const { sessionId } = await context.params
  const engine = getGameSession(sessionId)

  if (!engine) {
    return NextResponse.json({ success: false, message: 'Game session not found' }, { status: 404 })
  }

  const state: GameResponse = engine.getGameState()
  if (state.game_data) {
    state.game_data.session_id = sessionId
  }

  return NextResponse.json(state)
}

export async function DELETE(_: Request, context: { params: ParamsPromise }) {
  const { sessionId } = await context.params

  if (!getGameSession(sessionId)) {
    return NextResponse.json({ success: false, message: 'Game session not found' }, { status: 404 })
  }

  deleteGameSession(sessionId)
  return NextResponse.json({ success: true, message: 'Game session deleted' })
}

