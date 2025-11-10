"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LOCATIONS, LOCATION_CONNECTIONS, LondonMap } from "./london-map"
import { rollDice, randomInt, randomChoice } from "@/lib/random"

interface MovementHistory {
  day: number
  location: string
  distance: number
  direction: string
}

interface BeastTrackerProps {
  gameData: any
  setGameData: (data: any) => void
}

export function BeastTracker({ gameData, setGameData }: BeastTrackerProps) {
  const [movementHistory, setMovementHistory] = useState<MovementHistory[]>([])
  const [predictedLocations, setPredictedLocations] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState("current")

  const rollBeastLocation = () => {
    const roll = rollDice(8)
    let locationId: string

    if (roll <= 3) {
      // Nearby location (40%)
      const currentLoc = gameData.beastLocation || "I"
      const nearby = LOCATION_CONNECTIONS[currentLoc] || []
      locationId = randomChoice(nearby) || "I"
    } else if (roll <= 6) {
      // Random location (40%)
      locationId = randomChoice(LOCATIONS).id
    } else {
      // Very close to inquisitor (20%)
      locationId = gameData.playerLocation || "I"
    }

    const distance = calculateDistance(gameData.playerLocation || "I", locationId)
    const predicted = getPredictedLocations(locationId)
    setPredictedLocations(predicted)

    const beastLocName = LOCATIONS.find((l) => l.id === locationId)?.name || "Unknown"

    const newHistory: MovementHistory = {
      day: gameData.currentDay,
      location: beastLocName,
      distance,
      direction: getDirection(),
    }

    setMovementHistory([...movementHistory, newHistory])

    setGameData({
      ...gameData,
      beastLocation: locationId,
      beastDistance: distance,
    })
  }

  const calculateDistance = (fromId: string, toId: string): number => {
    if (fromId === toId) return 0
    const nearby = LOCATION_CONNECTIONS[fromId] || []
    if (nearby.includes(toId)) return 1
    return randomInt(2, 4)
  }

  const getDirection = (): string => {
    const directions = ["North", "South", "East", "West", "Northeast", "Northwest", "Southeast", "Southwest"]
    return randomChoice(directions)
  }

  const getPredictedLocations = (currentId: string): string[] => {
    const nearby = LOCATION_CONNECTIONS[currentId] || []
    return nearby.slice(0, 3)
  }

  const threatLevel = gameData.beastDistance === 0 ? "Critical" : gameData.beastDistance <= 2 ? "High" : "Moderate"
  const threatColor = gameData.beastDistance === 0 ? "red" : gameData.beastDistance <= 2 ? "orange" : "amber"

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full justify-start border-b border-amber-900/20 bg-transparent p-0 rounded-none gap-2">
        <TabsTrigger
          value="current"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
        >
          Current Status
        </TabsTrigger>
        <TabsTrigger
          value="map"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
        >
          Map
        </TabsTrigger>
        <TabsTrigger
          value="movement"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
        >
          Movement Log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="current" className="mt-6 space-y-6">
        {/* Threat Level */}
        <Card className="border-amber-900/50 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-amber-100">Beast Tracker</h2>
            <div className={`text-2xl font-bold text-${threatColor}-100`}>{threatLevel}</div>
          </div>
          <p className="text-amber-200/60 text-sm mb-6">
            Monitor the movements of the Eleventh Beast. Each day, roll to determine its location.
          </p>

          <Button
            onClick={rollBeastLocation}
            className="w-full bg-red-900 hover:bg-red-800 text-red-50 font-semibold py-3 mb-6"
          >
            Roll d8 - Track Beast Movement
          </Button>

          {gameData.beastLocation && (
            <div className="space-y-4">
              <div className={`bg-slate-800/30 border border-${threatColor}-900/50 rounded p-6 text-center`}>
                <p className={`text-${threatColor}-200/60 text-xs uppercase tracking-widest mb-3`}>Beast Located</p>
                <p className="text-3xl font-bold text-amber-100 mb-3">
                  {LOCATIONS.find((l) => l.id === gameData.beastLocation)?.name}
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div>
                    <p className="text-amber-200/60 text-xs uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-2xl font-bold text-amber-100">{gameData.beastDistance}</p>
                  </div>
                  {movementHistory.length > 0 && (
                    <div>
                      <p className="text-amber-200/60 text-xs uppercase tracking-widest mb-1">Direction</p>
                      <p className="text-2xl font-bold text-amber-100">
                        {movementHistory[movementHistory.length - 1].direction}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-slate-800/20 border border-amber-900/30 rounded p-4 text-center">
                {gameData.beastDistance === 0 && (
                  <p className="text-red-100 font-semibold">The Beast is HERE! Prepare for immediate combat!</p>
                )}
                {gameData.beastDistance === 1 && (
                  <p className="text-orange-100 font-semibold">The Beast is very close! Combat is imminent!</p>
                )}
                {gameData.beastDistance === 2 && (
                  <p className="text-amber-100 font-semibold">The Beast approaches! Prepare your defenses!</p>
                )}
                {gameData.beastDistance && gameData.beastDistance > 2 && (
                  <p className="text-amber-200">
                    The Beast is {gameData.beastDistance} movements away. You have time to prepare.
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Predicted Locations */}
        {predictedLocations.length > 0 && (
          <Card className="border-blue-900/50 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-blue-100 mb-4">Predicted Movements</h3>
            <p className="text-blue-200/60 text-sm mb-4">
              Based on recent behavior, the Beast may move to these locations:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {predictedLocations.map((locId) => {
                const loc = LOCATIONS.find((l) => l.id === locId)
                return (
                  <div key={locId} className="bg-blue-950/30 border border-blue-900/50 rounded p-3 text-center">
                    <p className="text-blue-100 text-sm font-semibold">{loc?.name}</p>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="map" className="mt-6">
        <LondonMap
          playerLocation={gameData.playerLocation || "I"}
          beastLocation={gameData.beastLocation}
          onPlayerMove={() => {}} // Movement handled in dashboard
          canMove={false}
        />
      </TabsContent>

      <TabsContent value="movement" className="mt-6">
        <Card className="border-amber-900/50 bg-slate-900/50 p-6">
          <h3 className="text-lg font-bold text-amber-100 mb-4">Movement History ({movementHistory.length})</h3>
          {movementHistory.length === 0 ? (
            <p className="text-amber-200/60 text-sm">No movement tracked yet. Roll to begin tracking.</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...movementHistory].reverse().map((entry, idx) => (
                <div key={idx} className="bg-slate-800/30 border border-amber-900/30 rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 font-semibold">{entry.location}</p>
                      <p className="text-amber-200/60 text-xs">
                        Day {entry.day} • {entry.direction} • Distance: {entry.distance}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}
