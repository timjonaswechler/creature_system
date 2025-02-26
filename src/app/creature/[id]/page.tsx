// src/app/creature/[id]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCreatureById } from '@/lib/creatureManager';
import { ICreature } from '@/interfaces/ICreature';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CreatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [creature, setCreature] = useState<ICreature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundCreature = getCreatureById(id);
      setCreature(foundCreature);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return <div>Lade Kreatur...</div>;
  }

  if (!creature) {
    return (
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Kreatur nicht gefunden</h1>
          <p className="mb-6">Die gesuchte Kreatur existiert nicht oder wurde gelöscht.</p>
          <Button onClick={() => router.push('/creature')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/creature')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
        </Button>
        <p className="text-muted-foreground">
          ID: {creature.id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allgemeine Informationen</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{creature.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Geburtsdatum</TableCell>
                  <TableCell>{new Date(creature.birthdate).toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mentaler Zustand</TableCell>
                  <TableCell>{creature.mentalState.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sozialer Zustand</TableCell>
                  <TableCell>{creature.socialState.name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eigenschaften</CardTitle>
            <CardDescription>
              Persönliche Eigenschaften dieser Kreatur
            </CardDescription>
          </CardHeader>
          <CardContent>
            {creature.traits.length === 0 ? (
              <p className="text-muted-foreground">Keine Eigenschaften definiert.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {creature.traits.map(trait => (
                  <Badge key={trait.id}>{trait.name}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fähigkeiten</CardTitle>
            <CardDescription>Erlernte Fähigkeiten der Kreatur</CardDescription>
          </CardHeader>
          <CardContent>
            {creature.skills.length === 0 ? (
              <p className="text-muted-foreground">Keine Fähigkeiten erlernt.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fähigkeit</TableHead>
                    <TableHead>Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creature.skills.map(skill => (
                    <TableRow key={skill.id}>
                      <TableCell>{skill.name}</TableCell>
                      <TableCell>{skill.level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ziele</CardTitle>
            <CardDescription>Aktuelle Ziele der Kreatur</CardDescription>
          </CardHeader>
          <CardContent>
            {creature.goals.length === 0 ? (
              <p className="text-muted-foreground">Keine Ziele definiert.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ziel</TableHead>
                    <TableHead>Priorität</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creature.goals.map(goal => (
                    <TableRow key={goal.id}>
                      <TableCell>{goal.name}</TableCell>
                      <TableCell>{goal.priority}</TableCell>
                      <TableCell>{goal.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}