// src/components/form/CreatureForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { createNewCreature, saveCreature, getCreatures } from '@/lib/creatureManager';
import { ICreature } from '@/interfaces/ICreature';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CreatureForm() {
  const router = useRouter();
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

  const handleViewCreature = (id: string) => {
    router.push(`/creature/${id}`);
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
          {Object.keys(creatures).length === 0 ? (
            <p className="text-muted-foreground">Noch keine Kreaturen erstellt.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Geburtsdatum</TableHead>
                  <TableHead>Eigenschaften</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(creatures).map((creature) => (
                  <TableRow key={creature.id} className="cursor-pointer hover:bg-muted">
                    <TableCell>{creature.name}</TableCell>
                    <TableCell>{new Date(creature.birthdate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge>{creature.traits.length} Eigenschaften</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewCreature(creature.id)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}