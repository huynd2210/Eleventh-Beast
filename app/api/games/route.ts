import { NextResponse } from 'next/server'

import {
  createGameSession,
  listSessions,
  type GameResponse,
} from '@/lib/server/game-engine'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { beast_name, inquisitor_name, seed } = body ?? {}

    if (!beast_name || !inquisitor_name) {
      return NextResponse.json(
        { success: false, message: 'Both beast_name and inquisitor_name are required.' },
        { status: 400 },
      )
    }

    const parsedSeed = typeof seed === 'number' ? seed : undefined
    const { sessionId, engine } = createGameSession(beast_name, inquisitor_name, parsedSeed)
    const state: GameResponse = engine.getGameState()

    if (state.game_data) {
      state.game_data.session_id = sessionId
    }

    return NextResponse.json({
      ...state,
      success: true,
      message: 'Game created successfully',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create game'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json(listSessions())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list game sessions'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}


