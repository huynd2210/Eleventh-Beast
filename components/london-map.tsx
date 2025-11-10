"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Define the 8 locations from the map image
export const LOCATIONS = [
  { id: "I", name: "The Royal Exchange", x: 50, y: 20 },
  { id: "II", name: "All-Hallows-The-Great", x: 30, y: 40 },
  { id: "III", name: "Billingsgate Dock", x: 70, y: 35 },
  { id: "IV", name: "London Bridge", x: 60, y: 55 },
  { id: "V", name: "St. Thomas' Hospital", x: 40, y: 65 },
  { id: "VI", name: "Coxes Wharf", x: 75, y: 70 },
  { id: "VII", name: "Marshalsea Prison", x: 35, y: 85 },
  { id: "VIII", name: "Burying Ground", x: 55, y: 90 },
]

// Graph connections based on your map image
export const LOCATION_CONNECTIONS: Record<string, string[]> = {
  I: ["II", "III"], // Royal Exchange connects to All-Hallows and Billingsgate
  II: ["I", "IV", "V"], // All-Hallows connects to Royal Exchange, London Bridge, St. Thomas
  III: ["I", "IV"], // Billingsgate connects to Royal Exchange, London Bridge
  IV: ["II", "III", "V", "VI"], // London Bridge central hub
  V: ["II", "IV", "VII", "VIII"], // St. Thomas' Hospital
  VI: ["IV", "VIII"], // Coxes Wharf
  VII: ["V", "VIII"], // Marshalsea Prison
  VIII: ["V", "VI", "VII"], // Burying Ground
}

interface LondonMapProps {
  playerLocation: string
  beastLocation: string | null
  rumorsTokens?: Record<string, boolean>
  onPlayerMove: (locationId: string) => Promise<void>
  canMove: boolean
  actionsRemaining?: number
  onActionUsed?: () => void
  addToLog?: (message: string) => void
  gameData?: any
  setGameData?: (data: any) => void
  locations?: any[]
  locationConnections?: Record<string, string[]>
}

export function LondonMap({
  playerLocation,
  beastLocation,
  rumorsTokens = {},
  onPlayerMove,
  canMove,
  actionsRemaining = 2,
  onActionUsed,
  addToLog,
  gameData,
  setGameData,
  locations = LOCATIONS,
  locationConnections = LOCATION_CONNECTIONS,
}: LondonMapProps) {
  const playerLoc = locations.find((l: any) => l.id === playerLocation)
  const beastLoc = beastLocation ? locations.find((l: any) => l.id === beastLocation) : null
  const connectedLocations = locationConnections[playerLocation] || []

  const handleMoveAction = async (targetLocationId: string) => {
    const targetLocation = locations.find((l: any) => l.id === targetLocationId)
    if (!targetLocation) return

    // Use the onPlayerMove callback to handle the move via API
    if (onPlayerMove) {
      await onPlayerMove(targetLocationId)
    }

    // Call onActionUsed after the move is complete to use up an action
    if (onActionUsed) {
      onActionUsed()
    }
  }

  return (
    <Card className="border-amber-900/50 bg-slate-900/50 p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-amber-100 mb-2">1746 London</h3>
          <p className="text-amber-200/60 text-xs mb-4">
            A map of the treacherous streets of London. Navigate to track and confront the Beast.
          </p>
        </div>

        {/* Interactive Map - SVG Graph Visualization */}
        <div className="bg-slate-800/30 border border-amber-900/30 rounded p-6 overflow-x-auto">
          <svg width="100%" height="400" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Draw connection lines */}
            {Object.entries(locationConnections).map(([fromId, toIds]) => {
              const fromLoc = locations.find((l: any) => l.id === fromId)
              return toIds.map((toId) => {
                if (fromId > toId) return null // Avoid duplicate lines
                const toLoc = locations.find((l: any) => l.id === toId)
                if (!fromLoc || !toLoc) return null
                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={fromLoc.x}
                    y1={fromLoc.y}
                    x2={toLoc.x}
                    y2={toLoc.y}
                    stroke="rgba(217, 119, 6, 0.3)"
                    strokeWidth="1.5"
                  />
                )
              })
            })}

            {/* Draw location nodes */}
            {locations.map((loc: any) => {
              const isPlayer = loc.id === playerLocation
              const isBeast = loc.id === beastLocation
              const hasRumorToken = rumorsTokens[loc.id]
              const isConnected = connectedLocations.includes(loc.id)

              return (
                <g key={loc.id}>
                  {/* Node circle */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r="4"
                    fill={isBeast ? "#dc2626" : isPlayer ? "#b45309" : "#1e293b"}
                    stroke={isBeast ? "#991b1b" : isPlayer ? "#78350f" : "#334155"}
                    strokeWidth="1"
                  />

                  {hasRumorToken && (
                    <g>
                      <circle cx={loc.x + 3} cy={loc.y - 3} r="1.5" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.5" />
                    </g>
                  )}

                  {/* Location label */}
                  <text x={loc.x} y={loc.y - 6} fontSize="4" textAnchor="middle" fill="#d4af37" fontWeight="bold">
                    {loc.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Location Information */}
        <div className="grid md:grid-cols-2 gap-4">
          {playerLoc && (
            <div className="bg-amber-950/30 border border-amber-900/50 rounded p-4">
              <p className="text-amber-200/60 text-xs uppercase tracking-widest mb-2">Your Location</p>
              <p className="text-amber-100 font-semibold">{playerLoc.name}</p>
              <p className="text-amber-200/60 text-xs mt-2">(Location {playerLoc.id})</p>
            </div>
          )}
          {beastLoc && (
            <div className="bg-red-950/30 border border-red-900/50 rounded p-4">
              <p className="text-red-200/60 text-xs uppercase tracking-widest mb-2">Beast Location</p>
              <p className="text-red-100 font-semibold">{beastLoc.name}</p>
              <p className="text-red-200/60 text-xs mt-2">(Location {beastLoc.id})</p>
            </div>
          )}
        </div>

        {/* Movement Options */}
        {canMove && connectedLocations.length > 0 && (
          <div>
            <p className="text-amber-200/60 text-xs uppercase tracking-widest mb-3">Move To (Action)</p>
            {actionsRemaining > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {connectedLocations.map((locId) => {
                  const loc = locations.find((l: any) => l.id === locId)
                  if (!loc) return null
                  return (
                    <Button
                      key={locId}
                      onClick={() => handleMoveAction(locId)}
                      variant="outline"
                      className="text-xs border-amber-900/50 text-amber-100 hover:bg-amber-800 hover:border-amber-600 hover:text-amber-50"
                    >
                      {loc.id} - {loc.name.split(" ").slice(0, 2).join(" ")}
                    </Button>
                  )
                })}
              </div>
            ) : (
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded">
                <p className="text-red-200/60 text-xs">No actions remaining for movement</p>
                <p className="text-red-200/40 text-xs mt-1">The day will end automatically...</p>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="bg-slate-800/20 border border-amber-900/20 rounded p-3 text-xs text-amber-200/60">
          <p className="font-semibold text-amber-200 mb-2">Map Legend:</p>
          <p>🟡 Your location • 🔴 Beast location • 🟣 Rumor token • Lines represent paths between locations</p>
        </div>
      </div>
    </Card>
  )
}
