"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PrepareHuntProps {
  gameData: any
  setGameData: (data: any) => void
  addToLog: (message: string) => void
}

const WARD_CATALOG = [
  {
    id: "w1",
    name: "Holy Water",
    type: "ward",
    description: "Purified water blessed by clergy. Burns evil on contact.",
    effect: "Reduces damage taken by 10%",
    cost: 0,
    rarity: "common",
    powerLevel: 1,
  },
  {
    id: "w2",
    name: "Iron Cross",
    type: "ward",
    description: "Forged iron in the shape of a cross. Repels supernatural entities.",
    effect: "Grants +5 defense. Works against unholy attacks.",
    cost: 0,
    rarity: "common",
    powerLevel: 1,
  },
  {
    id: "w3",
    name: "Salt Circle",
    type: "ward",
    description: "Blessed salt arranged in a protective circle.",
    effect: "Creates a temporary safe zone. Beast cannot enter.",
    cost: 0,
    rarity: "common",
    powerLevel: 2,
  },
  {
    id: "w4",
    name: "Sacred Rune",
    type: "ward",
    description: "Ancient symbols of power carved into bone.",
    effect: "Increases all action success by +2",
    cost: 0,
    rarity: "uncommon",
    powerLevel: 2,
  },
  {
    id: "w5",
    name: "Blessed Talisman",
    type: "ward",
    description: "A holy artifact imbued with the power of saints.",
    effect: "Grants divine protection. Negates one fatal blow.",
    cost: 0,
    rarity: "rare",
    powerLevel: 3,
  },
  {
    id: "w6",
    name: "Demon's Bane",
    type: "ward",
    description: "Crafted from materials the Beast fears most.",
    effect: "Doubles damage dealt to the Beast.",
    cost: 5,
    rarity: "rare",
    powerLevel: 3,
  },
]

const WEAPON_CATALOG = [
  {
    id: "wep1",
    name: "Blessed Blade",
    type: "weapon",
    description: "A sword blessed by priests. Cannot be corrupted.",
    effect: "Standard damage. Effective against most creatures.",
    damage: 15,
    accuracy: 70,
    rarity: "common",
    powerLevel: 1,
  },
  {
    id: "wep2",
    name: "Silver Dagger",
    type: "weapon",
    description: "A dagger of pure silver. Supernatural in origin.",
    effect: "Bonus damage to undead and supernatural beings.",
    damage: 12,
    accuracy: 85,
    rarity: "common",
    powerLevel: 1,
  },
  {
    id: "wep3",
    name: "Holy Flame",
    type: "weapon",
    description: "Fire that burns with holy purpose, never extinguishing.",
    effect: "Deals fire damage. Effective against dark creatures.",
    damage: 20,
    accuracy: 65,
    rarity: "uncommon",
    powerLevel: 2,
  },
  {
    id: "wep4",
    name: "Consecrated Hammer",
    type: "weapon",
    description: "A hammer blessed in sacred ground. Crushes evil.",
    effect: "High impact damage. Stuns on critical hit.",
    damage: 25,
    accuracy: 60,
    rarity: "uncommon",
    powerLevel: 2,
  },
  {
    id: "wep5",
    name: "Warded Bow",
    type: "weapon",
    description: "A bow that never misses against its chosen prey.",
    effect: "Ranged attacks. Homing arrows with +10 accuracy.",
    damage: 18,
    accuracy: 90,
    rarity: "rare",
    powerLevel: 3,
  },
  {
    id: "wep6",
    name: "Beast Slayer's Axe",
    type: "weapon",
    description: "Legendary weapon forged specifically to hunt demons.",
    effect: "Deals massive damage. Massive penalty if you lack knowledge.",
    damage: 35,
    accuracy: 50,
    rarity: "rare",
    powerLevel: 3,
  },
]

export function PrepareHunt({ gameData, setGameData, addToLog }: PrepareHuntProps) {
  const [activeTab, setActiveTab] = useState("arsenal")
  const [selectedWard, setSelectedWard] = useState("")
  const [selectedWeapon, setSelectedWeapon] = useState("")
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const addWard = () => {
    if (selectedWard) {
      const wardData = WARD_CATALOG.find((w) => w.id === selectedWard)
      if (wardData) {
        const newWard = {
          id: Date.now().toString(),
          ...wardData,
        }
        setGameData({
          ...gameData,
          wards: [...gameData.wards, newWard],
        })
        addToLog(`Ward acquired: ${wardData.name} - ${wardData.effect}`)
        setSelectedWard("")
      }
    }
  }

  const addWeapon = () => {
    if (selectedWeapon) {
      const weaponData = WEAPON_CATALOG.find((w) => w.id === selectedWeapon)
      if (weaponData) {
        const newWeapon = {
          id: Date.now().toString(),
          ...weaponData,
        }
        setGameData({
          ...gameData,
          weapons: [...gameData.weapons, newWeapon],
        })
        addToLog(`Weapon acquired: ${weaponData.name} - Damage: ${weaponData.damage}`)
        setSelectedWeapon("")
      }
    }
  }

  const removeWard = (id: string) => {
    const ward = gameData.wards.find((w: any) => w.id === id)
    setGameData({
      ...gameData,
      wards: gameData.wards.filter((w: any) => w.id !== id),
    })
    addToLog(`Ward removed: ${ward.name}`)
  }

  const removeWeapon = (id: string) => {
    const weapon = gameData.weapons.find((w: any) => w.id === id)
    setGameData({
      ...gameData,
      weapons: gameData.weapons.filter((w: any) => w.id !== id),
    })
    addToLog(`Weapon removed: ${weapon.name}`)
  }

  const getReadinessScore = () => {
    const wardPower = gameData.wards.reduce((sum: number, w: any) => sum + w.powerLevel, 0)
    const weaponPower = gameData.weapons.reduce((sum: number, w: any) => sum + w.powerLevel, 0)
    const knowledge = gameData.knowledge / 10
    return Math.min(100, Math.round(wardPower * 15 + weaponPower * 15 + knowledge * 10))
  }

  const readiness = getReadinessScore()
  const readinessColor = readiness < 30 ? "red" : readiness < 60 ? "amber" : readiness < 85 ? "blue" : "green"

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "gray"
      case "uncommon":
        return "green"
      case "rare":
        return "purple"
      default:
        return "amber"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b border-amber-900/20 bg-transparent p-0 rounded-none gap-2">
          <TabsTrigger
            value="arsenal"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
          >
            Arsenal
          </TabsTrigger>
          <TabsTrigger
            value="catalog"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
          >
            Catalog
          </TabsTrigger>
          <TabsTrigger
            value="preparation"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
          >
            Preparation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arsenal" className="mt-6 space-y-6">
          {/* Current Arsenal */}
          <div className="grid md:grid-cols-2 gap-6">
            {gameData.wards.length > 0 ? (
              <Card className="border-green-900/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-green-100 mb-4">Collected Wards ({gameData.wards.length})</h3>
                <div className="space-y-2">
                  {gameData.wards.map((ward: any) => (
                    <div
                      key={ward.id}
                      className="bg-slate-800/30 border border-green-900/30 rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-green-100 font-semibold text-sm">{ward.name}</p>
                        <p className="text-green-200/60 text-xs">{ward.effect}</p>
                      </div>
                      <Button
                        onClick={() => removeWard(ward.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-900/50 text-red-100 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="border-amber-900/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Wards</h3>
                <p className="text-amber-200/60 text-sm">
                  No wards collected yet. Visit the catalog to find protection.
                </p>
              </Card>
            )}

            {gameData.weapons.length > 0 ? (
              <Card className="border-red-900/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-red-100 mb-4">Collected Weapons ({gameData.weapons.length})</h3>
                <div className="space-y-2">
                  {gameData.weapons.map((weapon: any) => (
                    <div
                      key={weapon.id}
                      className="bg-slate-800/30 border border-red-900/30 rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-red-100 font-semibold text-sm">{weapon.name}</p>
                        <p className="text-red-200/60 text-xs">
                          Damage: {weapon.damage} | Accuracy: {weapon.accuracy}%
                        </p>
                      </div>
                      <Button
                        onClick={() => removeWeapon(weapon.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-900/50 text-red-100 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="border-amber-900/50 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-amber-100 mb-2">Weapons</h3>
                <p className="text-amber-200/60 text-sm">No weapons collected yet. Visit the catalog to find arms.</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          {/* Wards Catalog */}
          <Card className="border-green-900/50 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-bold text-green-100 mb-4">Ward Catalog</h2>
            <div className="space-y-3">
              {WARD_CATALOG.map((ward) => (
                <div
                  key={ward.id}
                  className="bg-slate-800/30 border border-green-900/30 rounded p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => setShowDetails(showDetails === ward.id ? null : ward.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-green-100">{ward.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded bg-${getRarityColor(ward.rarity)}-900/30 text-${getRarityColor(ward.rarity)}-200`}
                        >
                          {ward.rarity}
                        </span>
                      </div>
                      <p className="text-green-200/60 text-sm mb-2">{ward.description}</p>
                      {showDetails === ward.id && (
                        <div className="mt-3 pt-3 border-t border-green-900/30">
                          <p className="text-green-100 text-sm font-semibold mb-2">Effect:</p>
                          <p className="text-green-200/80 text-sm mb-3">{ward.effect}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedWard(ward.id)
                        addWard()
                      }}
                      size="sm"
                      className="bg-green-900 hover:bg-green-800 text-green-50 whitespace-nowrap"
                    >
                      Acquire
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Weapons Catalog */}
          <Card className="border-red-900/50 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-bold text-red-100 mb-4">Weapon Catalog</h2>
            <div className="space-y-3">
              {WEAPON_CATALOG.map((weapon) => (
                <div
                  key={weapon.id}
                  className="bg-slate-800/30 border border-red-900/30 rounded p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
                  onClick={() => setShowDetails(showDetails === weapon.id ? null : weapon.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-red-100">{weapon.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded bg-${getRarityColor(weapon.rarity)}-900/30 text-${getRarityColor(weapon.rarity)}-200`}
                        >
                          {weapon.rarity}
                        </span>
                      </div>
                      <p className="text-red-200/60 text-sm mb-2">{weapon.description}</p>
                      {showDetails === weapon.id && (
                        <div className="mt-3 pt-3 border-t border-red-900/30">
                          <p className="text-red-100 text-sm font-semibold mb-2">Stats:</p>
                          <p className="text-red-200/80 text-sm mb-2">
                            Damage: {weapon.damage} | Accuracy: {weapon.accuracy}%
                          </p>
                          <p className="text-red-200/80 text-sm">{weapon.effect}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedWeapon(weapon.id)
                        addWeapon()
                      }}
                      size="sm"
                      className="bg-red-900 hover:bg-red-800 text-red-50 whitespace-nowrap"
                    >
                      Acquire
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preparation" className="mt-6 space-y-6">
          <Card className={`border-${readinessColor}-900/50 bg-slate-900/50 p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold text-${readinessColor}-100`}>Hunt Readiness</h2>
              <div className={`text-4xl font-bold text-${readinessColor}-100`}>{readiness}%</div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full bg-gradient-to-r from-${readinessColor}-600 to-${readinessColor}-400 transition-all`}
                style={{ width: `${readiness}%` }}
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-amber-200/60 mb-1">Ward Power</p>
                <p className="text-amber-100 font-semibold">
                  {gameData.wards.reduce((sum: number, w: any) => sum + w.powerLevel, 0)} / 12
                </p>
              </div>
              <div>
                <p className="text-amber-200/60 mb-1">Weapon Power</p>
                <p className="text-amber-100 font-semibold">
                  {gameData.weapons.reduce((sum: number, w: any) => sum + w.powerLevel, 0)} / 12
                </p>
              </div>
              <div>
                <p className="text-amber-200/60 mb-1">Knowledge Bonus</p>
                <p className="text-amber-100 font-semibold">{Math.floor(gameData.knowledge / 10)} / 10</p>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="border-blue-900/50 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-blue-100 mb-4">Preparation Guide</h3>
            <div className="space-y-3 text-blue-200/80 text-sm">
              {gameData.wards.length === 0 && (
                <div className="flex gap-2">
                  <span className="text-red-400">!</span>
                  <p>No wards collected. Acquire at least 2 wards for protection.</p>
                </div>
              )}
              {gameData.weapons.length === 0 && (
                <div className="flex gap-2">
                  <span className="text-red-400">!</span>
                  <p>No weapons collected. You need arms to face the Beast.</p>
                </div>
              )}
              {gameData.knowledge < 50 && (
                <div className="flex gap-2">
                  <span className="text-amber-400">⚠</span>
                  <p>Limited knowledge. Investigate more to gain understanding of the Beast.</p>
                </div>
              )}
              {readiness >= 85 && (
                <div className="flex gap-2">
                  <span className="text-green-400">✓</span>
                  <p>You are well-prepared! The Beast will face formidable opposition.</p>
                </div>
              )}
              {readiness >= 60 && readiness < 85 && (
                <div className="flex gap-2">
                  <span className="text-amber-400">⚠</span>
                  <p>You are adequately prepared. Consider gathering more equipment.</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
