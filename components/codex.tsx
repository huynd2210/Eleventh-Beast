"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodexEntry {
  id: string
  category: "trait" | "weakness" | "ritual" | "history"
  title: string
  description: string
  discovered: boolean
  knowledgeValue: number
}

interface CodexProps {
  gameData: any
  setGameData: (data: any) => void
  addToLog: (message: string) => void
}

const BEAST_LORE: CodexEntry[] = [
  {
    id: "1",
    category: "trait",
    title: "Nocturnal Hunter",
    description: "The Beast hunts only under the cover of darkness. It retreats at dawn.",
    discovered: false,
    knowledgeValue: 15,
  },
  {
    id: "2",
    category: "trait",
    title: "Pack Behavior",
    description: "The Beast is rarely alone. It commands lesser creatures to do its bidding.",
    discovered: false,
    knowledgeValue: 15,
  },
  {
    id: "3",
    category: "weakness",
    title: "Vulnerability to Iron",
    description: "Blessed iron weapons can pierce through the Beast's supernatural defenses.",
    discovered: false,
    knowledgeValue: 25,
  },
  {
    id: "4",
    category: "weakness",
    title: "Holy Ground",
    description: "The Beast cannot cross blessed ground. Churches and consecrated ground are safe havens.",
    discovered: false,
    knowledgeValue: 25,
  },
  {
    id: "5",
    category: "ritual",
    title: "Banishment Circle",
    description: "A circle of salt and ash can temporarily bind the Beast, preventing its escape.",
    discovered: false,
    knowledgeValue: 30,
  },
  {
    id: "6",
    category: "ritual",
    title: "True Name Ritual",
    description: "Speaking the Beast's true name during combat weakens its power significantly.",
    discovered: false,
    knowledgeValue: 40,
  },
  {
    id: "7",
    category: "history",
    title: "Ancient Origin",
    description: "The Beast has plagued London for centuries, first recorded in 1682.",
    discovered: false,
    knowledgeValue: 10,
  },
]

export function Codex({ gameData, setGameData, addToLog }: CodexProps) {
  const [codexEntries, setCodexEntries] = useState<CodexEntry[]>(BEAST_LORE)
  const [activeTab, setActiveTab] = useState("traits")

  const discoverEntry = (id: string) => {
    const entry = codexEntries.find((e) => e.id === id)
    if (entry && !entry.discovered) {
      const updated = codexEntries.map((e) => (e.id === id ? { ...e, discovered: true } : e))
      setCodexEntries(updated)
      setGameData({
        ...gameData,
        knowledge: gameData.knowledge + entry.knowledgeValue,
      })
      addToLog(`Codex Updated: "${entry.title}" - Knowledge increased by ${entry.knowledgeValue}`)
    }
  }

  const getEntriesByCategory = (category: string) => {
    return codexEntries.filter((e) => e.category === category)
  }

  const discoveredCount = codexEntries.filter((e) => e.discovered).length
  const totalCount = codexEntries.length

  return (
    <div className="space-y-6">
      <Card className="border-amber-900/50 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-amber-100">Codex Inquisitorum</h2>
          <div className="text-amber-200/60 text-sm">
            Discovered: {discoveredCount} / {totalCount}
          </div>
        </div>
        <p className="text-amber-200/60 text-sm mb-6">
          Knowledge of the Beast grants power. Each discovery in the Codex strengthens your understanding.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b border-amber-900/20 bg-transparent p-0 rounded-none gap-2">
            <TabsTrigger
              value="traits"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
            >
              Traits
            </TabsTrigger>
            <TabsTrigger
              value="weaknesses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
            >
              Weaknesses
            </TabsTrigger>
            <TabsTrigger
              value="rituals"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
            >
              Rituals
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:bg-transparent"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traits" className="mt-4 space-y-3">
            {getEntriesByCategory("trait").map((entry) => (
              <CodexEntryCard key={entry.id} entry={entry} onDiscover={() => discoverEntry(entry.id)} />
            ))}
          </TabsContent>

          <TabsContent value="weaknesses" className="mt-4 space-y-3">
            {getEntriesByCategory("weakness").map((entry) => (
              <CodexEntryCard key={entry.id} entry={entry} onDiscover={() => discoverEntry(entry.id)} />
            ))}
          </TabsContent>

          <TabsContent value="rituals" className="mt-4 space-y-3">
            {getEntriesByCategory("ritual").map((entry) => (
              <CodexEntryCard key={entry.id} entry={entry} onDiscover={() => discoverEntry(entry.id)} />
            ))}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {getEntriesByCategory("history").map((entry) => (
              <CodexEntryCard key={entry.id} entry={entry} onDiscover={() => discoverEntry(entry.id)} />
            ))}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Knowledge Summary */}
      <Card className="border-green-900/50 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200/60 text-xs uppercase tracking-widest mb-1">Inquisitor's Knowledge</p>
            <p className="text-2xl font-bold text-green-100">{gameData.knowledge}</p>
          </div>
          <div className="text-right">
            <p className="text-green-200/60 text-xs uppercase tracking-widest mb-1">Discovery Progress</p>
            <div className="w-32 h-2 bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
                style={{ width: `${(discoveredCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function CodexEntryCard({
  entry,
  onDiscover,
}: {
  entry: CodexEntry
  onDiscover: () => void
}) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        entry.discovered ? "border-green-900/50 bg-green-950/20" : "border-amber-900/30 bg-slate-800/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-amber-100">{entry.title}</h4>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-900/30 text-amber-200">
              +{entry.knowledgeValue} XP
            </span>
          </div>
          <p className={`text-sm ${entry.discovered ? "text-green-200" : "text-amber-200/60"}`}>
            {entry.discovered ? entry.description : "Knowledge sealed..."}
          </p>
        </div>
        {!entry.discovered && (
          <Button
            onClick={onDiscover}
            size="sm"
            className="bg-amber-900 hover:bg-amber-800 text-amber-50 whitespace-nowrap"
          >
            Discover
          </Button>
        )}
        {entry.discovered && <div className="text-green-400 text-xl">✓</div>}
      </div>
    </div>
  )
}
