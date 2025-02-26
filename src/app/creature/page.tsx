"use client"

import { useState, useEffect } from "react"
import { getCreatures, createNewCreature, saveCreature } from "@/lib/creatureManager"
import { ICreature } from "@/interfaces/ICreature"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table" 

export function CreatureDataTable() {
  const [creatures, setCreatures] = useState<ICreature[]>([])
  const [creatureName, setCreatureName] = useState("")

  // Lade Kreaturen beim Mounten der Komponente
  useEffect(() => {
    loadCreatures()
  }, [])

  const loadCreatures = () => {
    const storedCreatures = getCreatures()
    setCreatures(Object.values(storedCreatures))
  }

  const handleCreateCreature = () => {
    if (!creatureName.trim()) return

    // Neue Kreatur erstellen
    const newCreature = createNewCreature(creatureName)
    
    // Kreatur speichern
    saveCreature(newCreature)
    
    // Lade Kreaturen neu, um sicherzustellen, dass die Tabelle aktuell ist
    loadCreatures()
    
    // Formular zurücksetzen
    setCreatureName("")
  }

  return (
    <div className="space-y-6">
      {/* <Card>
        <CardHeader>
          <CardTitle>Neue Kreatur erstellen</CardTitle>
          <CardDescription>
            Erstelle eine neue Kreatur in deiner Sammlung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="name">Name der Kreatur</Label>
              <Input
                id="name"
                value={creatureName}
                onChange={(e) => setCreatureName(e.target.value)}
                placeholder="Name eingeben..."
              />
            </div>
            <Button onClick={handleCreateCreature}>Kreatur erstellen</Button>
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Deine Kreaturen</CardTitle>
          <CardDescription>
            Alle deine erstellten Kreaturen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={creatures} />
        </CardContent>
      </Card>
    </div>
  )
}