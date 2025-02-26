"use client"

import { useState, useEffect } from "react"
import { getCreatures } from "@/lib/creatureManager"
import { ICreature } from "@/interfaces/ICreature"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table" 
import { CreatureModal } from "@/components/form/CreatureModal"

export default function CreaturePage() {
  const [creatures, setCreatures] = useState<ICreature[]>([])

  // Load creatures when component mounts
  useEffect(() => {
    loadCreatures()
  }, [])

  const loadCreatures = () => {
    const storedCreatures = getCreatures()
    setCreatures(Object.values(storedCreatures))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Creatures</h2>
          <p className="text-muted-foreground">
            Manage your creature collection
          </p>
        </div>
        <CreatureModal onCreatureCreated={loadCreatures} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Creatures</CardTitle>
          <CardDescription>
            View and manage all your created creatures
          </CardDescription>
        </CardHeader>
        <CardContent>
          
            <DataTable columns={columns} data={creatures} />
          
        </CardContent>
      </Card>
    </div>
  )
}