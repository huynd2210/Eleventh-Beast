"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { rollDice, randomInt } from "@/lib/random"

interface CombatAction {
  id: string
  name: string
  description: string
  diceType: number
  difficulty: number
  cost: number
  reward: number
  riskLevel: "low" | "medium" | "high"
}

interface CombatArenaProps {
  gameData: any
  setGameData: (data: any) => void
  addToLog: (message: string) => void
  onCombatEnd: (victory: boolean) => void
}

const COMBAT_ACTIONS: CombatAction[] = [
  {
    id: "1",
    name: "Defensive Stance",
    description: "Focus on defense to reduce incoming damage. Safe but low damage.",
    diceType: 6,
    difficulty: 2,
    cost: 0,
    reward: 5,
    riskLevel: "low",
  },
  {
    id: "2",
    name: "Careful Strike",
    description: "A measured attack with good accuracy. Balanced risk and reward.",
    diceType: 8,
    difficulty: 4,
    cost: 5,
    reward: 15,
    riskLevel: "medium",
  },
  {
    id: "3",
    name: "Powerful Blow",
    description: "A risky all-out attack. High reward but dangerous if it fails.",
    diceType: 12,
    difficulty: 7,
    cost: 10,
    reward: 30,
    riskLevel: "high",
  },
  {
    id: "4",
    name: "Ritual Invocation",
    description: "Channel learned secrets for supernatural assistance. Requires knowledge.",
    diceType: 20,
    difficulty: 10,
    cost: 0,
    reward: 40,
    riskLevel: "high",
  },
  {
    id: "5",
    name: "Activate Ward",
    description: "Use a prepared ward to protect yourself or damage the Beast.",
    diceType: 8,
    difficulty: 4,
    cost: 0,
    reward: 20,
    riskLevel: "medium",
  },
  {
    id: "6",
    name: "Retreat",
    description: "Attempt to escape the combat and flee to safety.",
    diceType: 10,
    difficulty: 5,
    cost: 0,
    reward: 0,
    riskLevel: "low",
  },
]

export function CombatArena({ gameData, setGameData, addToLog, onCombatEnd }: CombatArenaProps) {
  const [inCombat, setInCombat] = useState(false)
  const [beastHealth, setBeastHealth] = useState(100)
  const [inquisitorHealth, setInquisitorHealth] = useState(gameData.health)
  const [combatLog, setCombatLog] = useState<string[]>([])
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null)
  const [actionResult, setActionResult] = useState<{
    roll: number
    success: boolean
    damage: number
    message: string
  } | null>(null)

  const startCombat = () => {
    setInCombat(true)
    setBeastHealth(100)
    setInquisitorHealth(gameData.health)
    setCombatLog([`Combat initiated with ${gameData.beastName}!`])
    addToLog(`COMBAT STARTED with ${gameData.beastName} at ${gameData.beastLocation}!`)
  }

  const executeAction = (action: CombatAction) => {
    if (gameData.weapons.length === 0 && action.id !== "4" && action.id !== "5" && action.id !== "6") {
      const message = "You have no weapons! Search for arms before engaging in melee combat."
      setCombatLog([...combatLog, message])
      return
    }

    const roll = rollDice(action.diceType)
    const success = roll >= action.difficulty

    let damage = 0
    let message = ""

    if (success) {
      damage = Math.floor(action.reward + roll / 2)

      if (action.id === "4") {
        const knowledgeBonus = Math.floor(gameData.knowledge / 10)
        damage += knowledgeBonus
        message = `${action.name}: Critical success! (Rolled ${roll}) Knowledge amplifies the effect!`
      } else if (action.id === "5") {
        if (gameData.wards.length === 0) {
          message = "No wards available to activate!"
          damage = 0
        } else {
          message = `${action.name}: Success! (Rolled ${roll}) Ward activates powerfully!`
        }
      } else if (action.id === "6") {
        message = `${action.name}: Successfully fled from combat!`
        setActionResult({ roll, success, damage: 0, message })
        setTimeout(() => {
          setInCombat(false)
          onCombatEnd(false)
        }, 1500)
        return
      } else {
        message = `${action.name}: Hit! (Rolled ${roll}) Dealt ${damage} damage!`
      }

      const newBeastHealth = Math.max(0, beastHealth - damage)
      setBeastHealth(newBeastHealth)

      if (newBeastHealth === 0) {
        setCombatLog([...combatLog, `${message} BEAST DEFEATED!`])
        setActionResult({ roll, success, damage, message: `${message} VICTORY!` })
        setTimeout(() => {
          setInCombat(false)
          onCombatEnd(true)
        }, 2000)
        return
      }
    } else {
      message = `${action.name}: Miss! (Rolled ${roll}, needed ${action.difficulty}) The Beast strikes back!`
      damage = randomInt(10, 24)
      const newInquisitorHealth = Math.max(0, inquisitorHealth - damage)
      setInquisitorHealth(newInquisitorHealth)

      if (newInquisitorHealth === 0) {
        setCombatLog([...combatLog, `${message} YOU HAVE FALLEN!`])
        setActionResult({ roll, success, damage, message: `${message} DEFEAT!` })
        setTimeout(() => {
          setInCombat(false)
          onCombatEnd(false)
        }, 2000)
        return
      }
    }

    if (success && action.id !== "6") {
      const counterRoll = rollDice(8)
      const counterDamage = counterRoll + 5
      const newInquisitorHealth = Math.max(0, inquisitorHealth - counterDamage)
      setInquisitorHealth(newInquisitorHealth)
      message += ` The Beast retaliates for ${counterDamage} damage!`

      if (newInquisitorHealth === 0) {
        message += " YOU HAVE FALLEN!"
        setCombatLog([...combatLog, message])
        setActionResult({ roll, success, damage, message })
        setTimeout(() => {
          setInCombat(false)
          onCombatEnd(false)
        }, 2000)
        return
      }
    }

    setCombatLog([...combatLog, message])
    setActionResult({ roll, success, damage, message })
    setSelectedAction(null)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "green"
      case "medium":
        return "amber"
      case "high":
        return "red"
      default:
        return "gray"
    }
  }

  if (!inCombat) {
    return (
      <Card className="border-red-900/50 bg-slate-900/50 p-6">
        <h2 className="text-2xl font-bold text-red-100 mb-4">Hunt the Beast</h2>
        <p className="text-red-200/60 text-sm mb-6">
          The moment has come. You face {gameData.beastName} at {gameData.beastLocation}. Are you ready?
        </p>
        <Button onClick={startCombat} className="w-full bg-red-900 hover:bg-red-800 text-red-50 font-semibold py-3">
          Enter Combat
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Combat Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-amber-900/50 bg-slate-900/50 p-4">
          <div className="text-amber-200/60 text-xs uppercase tracking-widest mb-2">Your Health</div>
          <div className="text-2xl font-bold text-amber-100 mb-2">{inquisitorHealth}%</div>
          <div className="h-2 bg-slate-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-red-600 transition-all"
              style={{ width: `${inquisitorHealth}%` }}
            />
          </div>
        </Card>

        <Card className="border-red-900/50 bg-slate-900/50 p-4">
          <div className="text-red-200/60 text-xs uppercase tracking-widest mb-2">Beast Health</div>
          <div className="text-2xl font-bold text-red-100 mb-2">{beastHealth}%</div>
          <div className="h-2 bg-slate-800 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-800 transition-all"
              style={{ width: `${beastHealth}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Action Result */}
      {actionResult && (
        <Card className={`border-${actionResult.success ? "green" : "red"}-900/50 bg-slate-900/50 p-4`}>
          <div className={`text-${actionResult.success ? "green" : "red"}-100 font-semibold text-center`}>
            {actionResult.message}
          </div>
        </Card>
      )}

      {/* Combat Actions */}
      <Card className="border-amber-900/50 bg-slate-900/50 p-6">
        <h3 className="text-lg font-bold text-amber-100 mb-4">Choose Your Action</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {COMBAT_ACTIONS.map((action) => {
            const color = getRiskColor(action.riskLevel)
            const canUseAction = action.id !== "5" || gameData.wards.length > 0
            return (
              <Button
                key={action.id}
                onClick={() => executeAction(action)}
                disabled={!canUseAction}
                className={`h-auto p-3 text-left flex flex-col gap-1 bg-${color}-900/30 hover:bg-${color}-900/50 text-${color}-100 border border-${color}-900/50`}
                variant="outline"
              >
                <div className="font-semibold text-sm">{action.name}</div>
                <div className="text-xs opacity-75">{action.description}</div>
                <div className="text-xs font-mono">{action.riskLevel.toUpperCase()}</div>
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Combat Log */}
      <Card className="border-amber-900/50 bg-slate-900/50 p-6">
        <h3 className="text-lg font-bold text-amber-100 mb-4">Combat Log</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...combatLog].reverse().map((log, idx) => (
            <div key={idx} className="text-amber-100 text-sm border-l-2 border-amber-600 pl-3">
              {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
