"use client"

import { useState } from "react"
import { GameSetup } from "@/components/game-setup"
import { GameDashboard } from "@/components/game-dashboard"

export default function Home() {
  const [gameState, setGameState] = useState<{
    hasStarted: boolean
    gameData: any
    gameLog: any[]
    sessionId?: string
  }>({
    hasStarted: false,
    gameData: null,
    gameLog: [],
  })

  const handleStartGame = (apiResponse: any) => {
    // Handle the new API response format
    setGameState({
      hasStarted: true,
      gameData: apiResponse.game_data,
      gameLog: apiResponse.game_log || [],
      sessionId: apiResponse.game_data?.session_id,
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {!gameState.hasStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <GameDashboard
          gameData={gameState.gameData}
          setGameData={(data) => {
            // Handle both old format (just game data) and new format (API response)
            const apiResponse = data as any;
            if (apiResponse && typeof apiResponse === 'object' && 'game_data' in apiResponse) {
              setGameState({
                hasStarted: true,
                gameData: apiResponse.game_data,
                gameLog: apiResponse.game_log || [],
                sessionId: apiResponse.game_data?.session_id
              })
            } else {
              setGameState(prev => ({
                hasStarted: true,
                gameData: data,
                gameLog: prev.gameLog,
                sessionId: prev.sessionId
              }))
            }
          }}
          gameLog={gameState.gameLog}
          setGameLog={(log) =>
            setGameState((prev) => ({
              ...prev,
              gameLog: log,
            }))
          }
        />
      )}
    </main>
  )
}
