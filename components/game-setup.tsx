"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { gameAPI } from "@/lib/game-api"

interface GameSetupProps {
  onStartGame: (gameData: any) => void
}

const BEAST_ADJECTIVES = ["Black", "Marsh", "Moon", "Blood", "Wild", "Bone", "Grave", "Spider"]
const BEAST_CREATURES = ["Wolf", "Grim", "Hag", "Goat", "Worm", "Barghest", "Fiend", "Banshee"]
const BEAST_LOCATIONS = [
  "Westminster",
  "Hogesdon",
  "Moorgate",
  "Lambton",
  "Blackfriars",
  "Sockburn",
  "Southwark",
  "Whitechapel",
]

function rollBeastName(): string {
  const adj = BEAST_ADJECTIVES[Math.floor(Math.random() * BEAST_ADJECTIVES.length)]
  const creature = BEAST_CREATURES[Math.floor(Math.random() * BEAST_CREATURES.length)]
  const location = BEAST_LOCATIONS[Math.floor(Math.random() * BEAST_LOCATIONS.length)]
  return `The ${adj} ${creature} of ${location}`
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [inquisitorName, setInquisitorName] = useState("")
  const [beastName, setBeastName] = useState(rollBeastName())
  const [step, setStep] = useState<"intro" | "name" | "beast">("intro")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [seedValue, setSeedValue] = useState("")

  const handleRollBeast = () => {
    setBeastName(rollBeastName())
    setError(null)
  }

  const handleRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1_000_000_000)
    setSeedValue(String(randomSeed))
    setError(null)
  }

  const handleStart = async () => {
    if (!inquisitorName.trim() || !beastName.trim()) {
      setError("Please provide both names")
      return
    }

    setIsLoading(true)
    setError(null)

    let parsedSeed: number | undefined
    if (seedValue.trim()) {
      const seedNumber = Number(seedValue.trim())
      if (!Number.isFinite(seedNumber) || !Number.isInteger(seedNumber)) {
        setError("Seed must be a whole number")
        setIsLoading(false)
        return
      }
      parsedSeed = seedNumber
    }

    try {
      const response = await gameAPI.createGame({
        beast_name: beastName,
        inquisitor_name: inquisitorName,
        seed: parsedSeed,
      })

      if (response.success && response.game_data) {
        onStartGame(response)
      } else {
        setError(response.message || "Failed to create game")
      }
    } catch (err) {
      console.error("Failed to create game:", err)
      setError(err instanceof Error ? err.message : "Failed to connect to game server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-amber-900/50 bg-slate-900/50 backdrop-blur">
        <div className="p-8 md:p-12 space-y-8">
          {step === "intro" && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-5xl md:text-6xl font-bold text-amber-100 tracking-wider">ELEVENTH BEAST</div>
                <div className="text-amber-200/60 text-lg italic">A Solo Monster Hunting Game</div>
              </div>

              <div className="space-y-4 text-amber-100/80 text-center">
                <p className="text-sm leading-relaxed">
                  The year is 1746. You are a Crown Inquisitor of Salomon's House, a secret order of daemon hunters
                  appointed by the King.
                </p>
                <p className="text-sm leading-relaxed">
                  The ELEVENTH BEAST approaches. Investigate rumors. Learn its secrets. Prepare for the hunt.
                </p>
              </div>

              <div className="border-t border-amber-900/30 pt-6">
                <Button
                  onClick={() => setStep("name")}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-amber-50 font-semibold py-2"
                >
                  Begin Investigation
                </Button>
              </div>
            </div>
          )}

          {step === "name" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-100 mb-2">Your Name</h2>
                <p className="text-amber-200/60 text-sm">Record yourself as an Inquisitor</p>
              </div>

              <div className="space-y-2">
                <label className="block text-amber-200 text-sm font-medium">Inquisitor Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={inquisitorName}
                  onChange={(e) => setInquisitorName(e.target.value)}
                  className="bg-slate-800/50 border-amber-900/50 text-amber-50 placeholder:text-amber-900/50"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep("intro")}
                  variant="outline"
                  className="flex-1 border-amber-900/50 text-amber-100 hover:bg-amber-900/20"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("beast")}
                  disabled={!inquisitorName.trim()}
                  className="flex-1 bg-amber-900 hover:bg-amber-800 text-amber-50 font-semibold"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "beast" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-100 mb-2">The Beast Emerges</h2>
                <p className="text-amber-200/60 text-sm">Discover what threatens London</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800/30 border border-amber-900/50 rounded-lg p-6 text-center">
                  <p className="text-amber-200/60 text-sm uppercase tracking-widest mb-2">The Beast is</p>
                  <p className="text-3xl font-bold text-amber-100 mb-4">{beastName}</p>
                  <button
                    onClick={handleRollBeast}
                    className="text-amber-600 hover:text-amber-500 text-xs uppercase tracking-widest"
                  >
                    Re-roll
                  </button>
                </div>
  
              <div className="bg-slate-800/30 border border-amber-900/50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-amber-200 text-sm font-medium mb-2">
                    Seed (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter a numeric seed or leave blank"
                    value={seedValue}
                    onChange={(e) => setSeedValue(e.target.value)}
                    className="bg-slate-800/50 border-amber-900/50 text-amber-50 placeholder:text-amber-900/50"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRandomSeed}
                    className="border-amber-900/50 text-amber-100 hover:bg-amber-900/20"
                  >
                    Randomize Seed
                  </Button>
                  {seedValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSeedValue("")}
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/10"
                    >
                      Clear Seed
                    </Button>
                  )}
                </div>
              </div>

                  {error && (
                    <div className="bg-red-950/30 border border-red-900/50 rounded p-3">
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  )}
                </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setStep("name")}
                  variant="outline"
                  className="flex-1 border-amber-900/50 text-amber-100 hover:bg-amber-900/20"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleStart}
                  disabled={!beastName.trim() || isLoading}
                  className="flex-1 bg-amber-900 hover:bg-amber-800 text-amber-50 font-semibold"
                >
                  {isLoading ? "Creating Game..." : "Hunt the Beast"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
