"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActionsPanelProps {
  gameData: any
  setGameData: (data: any) => void
  addToLog: (message: string) => void
  onActionsComplete: () => void
  onHuntTriggered: () => void
  actionsRemaining: number
  onCompleteAction: () => void
}

export function ActionsPanel(props: ActionsPanelProps) {
  return (
    <Card className="border-amber-900/50 bg-slate-900/50 p-6">
      <h2 className="text-2xl font-bold text-amber-100 mb-2">II. TAKE ACTIONS</h2>
      <p className="text-amber-200/60 text-sm mb-4">
        The game is running on the Python backend. Actions are processed server-side.
      </p>
      <p className="text-amber-200/60 text-sm">
        Backend API: http://localhost:8000
      </p>
      <div className="mt-4 p-4 bg-slate-800/30 border border-amber-900/30 rounded">
        <p className="text-amber-100 text-sm">Python game engine is active and ready for game actions.</p>
      </div>
    </Card>
  )
}