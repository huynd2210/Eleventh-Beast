import { NextResponse } from 'next/server'

import {
  getGameSession,
  type GameResponse,
} from '@/lib/server/game-engine'

interface GameActionRequest {
  session_id: string
  action_type: 'move' | 'investigate' | 'verify' | 'hunt' | 'complete_action'
  target_location?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GameActionRequest
    const { session_id: sessionId, action_type: actionType, target_location: targetLocation } = body

    if (!sessionId || !actionType) {
      return NextResponse.json(
        { success: false, message: 'session_id and action_type are required.' },
        { status: 400 },
      )
    }

    const engine = getGameSession(sessionId)
    if (!engine) {
      return NextResponse.json({ success: false, message: 'Game session not found' }, { status: 404 })
    }

    let result: GameResponse
    switch (actionType) {
      case 'move': {
        if (!targetLocation) {
          return NextResponse.json(
            { success: false, message: 'Target location required for move action' },
            { status: 400 },
          )
        }
        result = engine.movePlayer(targetLocation)
        break
      }
      case 'investigate':
        result = engine.investigate()
        break
      case 'verify':
        result = engine.verifyRumors()
        break
      case 'hunt':
        result = engine.huntBeast()
        break
      case 'complete_action':
        result = engine.completeAction()
        break
      default:
        return NextResponse.json({ success: false, message: `Unknown action type: ${actionType}` }, { status: 400 })
    }

    if (result.game_data) {
      result.game_data.session_id = sessionId
    }

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to perform action'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}


