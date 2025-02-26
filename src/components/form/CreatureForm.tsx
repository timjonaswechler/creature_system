// src/components/CreatureForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { createNewCreature, saveCreature, getCreatures } from '@/lib/creatureManager';
import { ICreature } from '@/interfaces/ICreature';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CreatureForm() {
  const [creatures, setCreatures] = useState<Record<string, ICreature>>({});
  const [creatureName, setCreatureName] = useState('');

  // Beim Laden der Komponente die gespeicherten Kreaturen holen
  useEffect(() => {
    const storedCreatures = getCreatures();
    setCreatures(storedCreatures);
  }, []);

  const handleCreateCreature = () => {
    if (!creatureName.trim()) return;
    
    // Neue Kreatur erstellen
    const newCreature = createNewCreature(creatureName);
    
    // Kreatur speichern
    saveCreature(newCreature);
    
    // State aktualisieren
    setCreatures(prev => ({
      ...prev,
      [newCreature.id]: newCreature
    }));
    
    // Formular zurücksetzen
    setCreatureName('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Neue Kreatur erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name der Kreatur</Label>
              <Input 
                id="name" 
                value={creatureName} 
                onChange={(e) => setCreatureName(e.target.value)}
                placeholder="Gib einen Namen ein..." 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateCreature}>Kreatur erstellen</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deine Kreaturen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(creatures).length === 0 ? (
              <p className="text-muted-foreground">Noch keine Kreaturen erstellt.</p>
            ) : (
              <ul className="space-y-3">
                {Object.values(creatures).map((creature) => (
                  <li key={creature.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{creature.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Geboren: {new Date(creature.birthdate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge>{creature.traits.length} Eigenschaften</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}