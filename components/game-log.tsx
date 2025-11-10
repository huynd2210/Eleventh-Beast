"use client"

import { Card } from "@/components/ui/card"

interface GameLogProps {
  logs: Array<{ id: string; message: string; timestamp: number }>
}

export function GameLog({ logs }: GameLogProps) {
  return (
    <Card className="border-amber-900/50 bg-slate-900/50 p-6">
      <h2 className="text-lg font-bold text-amber-100 mb-4">Investigation Log</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs
          .slice()
          .reverse()
          .map((log) => (
            <div key={log.id} className="border-l-2 border-amber-600 pl-4 py-2">
              <p className="text-amber-100 text-sm">{log.message}</p>
              <p className="text-amber-600/50 text-xs mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
      </div>
    </Card>
  )
}
