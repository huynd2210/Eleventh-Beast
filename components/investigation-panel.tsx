"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Codex } from "./codex"

const LOCATIONS = [
  "Westminster",
  "Hogesdon",
  "Moorgate",
  "Lambton",
  "Blackfriars",
  "Sockburn",
  "Southwark",
  "Whitechapel",
]

interface InvestigationPanelProps {
  gameData: any
  setGameData: (data: any) => void
  addToLog: (message: string) => void
}

export function InvestigationPanel({ gameData, setGameData, addToLog }: InvestigationPanelProps) {
  const [newNote, setNewNote] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [rumor, setRumor] = useState("")

  const addRumor = () => {
    if (selectedLocation && rumor) {
      const newRumor = {
        id: Date.now().toString(),
        location: selectedLocation,
        note: rumor,
        verified: false,
      }
      setGameData({
        ...gameData,
        investigation: {
          ...gameData.investigation,
          rumors: [...gameData.investigation.rumors, newRumor],
        },
      })
      addToLog(`Rumor recorded at ${selectedLocation}: "${rumor}"`)
      setRumor("")
    }
  }

  // Removed verifyRumor function - verification only happens during Actions phase

  const deleteRumor = (id: string) => {
    setGameData({
      ...gameData,
      investigation: {
        ...gameData.investigation,
        rumors: gameData.investigation.rumors.filter((r: any) => r.id !== id),
      },
    })
  }

  return (
    <Tabs defaultValue="investigation" className="w-full">
      <TabsList className="w-full justify-start border-b border-amber-900/20 bg-transparent p-0 rounded-none gap-4">
        <TabsTrigger
          value="investigation"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
        >
          Investigation
        </TabsTrigger>
        <TabsTrigger
          value="codex"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
        >
          Codex
        </TabsTrigger>
      </TabsList>

      <TabsContent value="investigation" className="mt-6 space-y-6">
        {/* Rumor Recording */}
        <Card className="border-amber-900/50 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold text-amber-100 mb-4">Record Rumors</h2>
          <p className="text-amber-200/60 text-sm mb-6">
            Gather information from across London. Verify them at All-Hallows-The-Great during the Actions phase to learn true secrets.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-amber-200 text-sm font-medium mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-800/50 border border-amber-900/50 text-amber-50 rounded px-3 py-2 text-sm"
              >
                <option value="">Select a location...</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-amber-200 text-sm font-medium mb-2">Rumor</label>
              <Textarea
                value={rumor}
                onChange={(e) => setRumor(e.target.value)}
                placeholder="What have you discovered about the Beast?"
                className="bg-slate-800/50 border-amber-900/50 text-amber-50 placeholder:text-amber-900/50"
                rows={3}
              />
            </div>

            <Button onClick={addRumor} className="w-full bg-amber-900 hover:bg-amber-800 text-amber-50 font-semibold">
              Record Rumor
            </Button>
          </div>
        </Card>

        {/* Unverified Rumors */}
        {gameData.investigation.rumors.length > 0 && (
          <Card className="border-amber-900/50 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-amber-100 mb-4">
              Unverified Rumors ({gameData.investigation.rumors.filter((r: any) => !r.verified).length})
            </h3>
            <div className="space-y-3">
              {gameData.investigation.rumors
                .filter((r: any) => !r.verified)
                .map((r: any) => (
                  <div key={r.id} className="bg-slate-800/30 border border-amber-900/30 rounded p-4 flex gap-4">
                    <div className="flex-1">
                      <p className="text-amber-200 text-xs uppercase tracking-widest mb-1">{r.location}</p>
                      <p className="text-amber-100">{r.note}</p>
                    </div>
                    <Button
                      onClick={() => deleteRumor(r.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-900/50 text-red-100 hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Learned Secrets */}
        {gameData.investigation.secrets.length > 0 && (
          <Card className="border-green-900/50 bg-slate-900/50 p-6">
            <h3 className="text-lg font-bold text-green-100 mb-4">
              Learned Secrets ({gameData.investigation.secrets.length})
            </h3>
            <div className="space-y-2">
              {gameData.investigation.secrets.map((s: any) => (
                <div key={s.id} className="bg-slate-800/30 border border-green-900/30 rounded p-3">
                  <p className="text-green-100 text-sm">{s.secret}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="codex" className="mt-6">
        <Codex gameData={gameData} setGameData={setGameData} addToLog={addToLog} />
      </TabsContent>
    </Tabs>
  )
}
