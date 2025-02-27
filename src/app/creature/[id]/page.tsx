// src/app/creature/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCreatureById } from "@/lib/creatureManager";
import { ICreature } from "@/interfaces/ICreature";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TraitEditor } from "@/components/form/TraitEditor";
import { SkillEditor } from "@/components/form/SkillEditor";
import { ISkill } from "@/interfaces/ISkill";

function getSkillDisplayName(skill: ISkill): string {
  const levelNames = [
    "Not",
    "Dabbling",
    "Novice",
    "Adequate",
    "Competent",
    "Skilled",
    "Proficient",
    "Talented",
    "Adept",
    "Expert",
    "Professional",
    "Accomplished",
    "Great",
    "Master",
    "High Master",
    "Grand Master",
    "Legendary",
  ];

  const baseName = levelNames[skill.level] || "Legendary";

  if (skill.level > 15) {
    const plusCount = skill.level - 15;
    return `${baseName}${"+".repeat(plusCount)}`;
  }

  return baseName;
}

export default function CreatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [creature, setCreature] = useState<ICreature | null>(null);
  const [loading, setLoading] = useState(true);
  // Füge einen useState für die Aktualisierung hinzu
  const [refreshData, setRefreshData] = useState(false);

  // Füge eine Funktion für die Aktualisierung hinzu
  const refreshCreatureData = () => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundCreature = getCreatureById(id);
      setCreature(foundCreature);
      setRefreshData((prev) => !prev);
    }
  };

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
  console.log(creature);
  if (!creature) {
    return (
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Kreatur nicht gefunden</h1>
          <p className="mb-6">
            Die gesuchte Kreatur existiert nicht oder wurde gelöscht.
          </p>
          <Button onClick={() => router.push("/creature")}>
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
          onClick={() => router.push("/creature")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
        </Button>
        <p className="text-muted-foreground">ID: {creature.id}</p>
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
                  <TableCell>
                    {new Date(creature.birthdate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Mentaler Zustand
                  </TableCell>
                  <TableCell>
                    {creature.mentalStates.length > 0
                      ? creature.mentalStates[0].name
                      : "Normal"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Sozialer Zustand
                  </TableCell>
                  <TableCell>
                    {creature.socialRelations.length > 0
                      ? `${creature.socialRelations.length} Beziehungen`
                      : "Keine Beziehungen"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Eigenschaften</CardTitle>
              <CardDescription>
                Persönliche Eigenschaften dieser Kreatur
              </CardDescription>
            </div>
            {creature && (
              <TraitEditor
                creature={creature}
                onTraitAdded={refreshCreatureData}
              />
            )}
          </CardHeader>
          <CardContent>
            {creature.traits.length === 0 ? (
              <p className="text-muted-foreground">
                Keine Eigenschaften definiert.
              </p>
            ) : (
              <div className="space-y-2">
                {creature.traits.map((trait) => (
                  <div key={trait.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{trait.name}</div>
                      <Badge
                        variant={
                          trait.impact === "POSITIVE"
                            ? "default"
                            : trait.impact === "NEGATIVE"
                            ? "destructive"
                            : trait.impact === "NEUTRAL"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {trait.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trait.description}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Kategorie: {trait.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Eigenschaften</CardTitle>
              <CardDescription>
                Persönliche Eigenschaften dieser Kreatur
              </CardDescription>
            </div>
            {creature && (
              <TraitEditor
                creature={creature}
                onTraitAdded={refreshCreatureData}
              />
            )}
          </CardHeader>
          <CardContent>
            {creature.traits.length === 0 ? (
              <p className="text-muted-foreground">
                Keine Eigenschaften definiert.
              </p>
            ) : (
              <div className="space-y-2">
                {creature.traits.map((trait) => (
                  <div key={trait.id} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{trait.name}</div>
                      <Badge
                        variant={
                          trait.impact === "POSITIVE"
                            ? "default"
                            : trait.impact === "NEGATIVE"
                            ? "destructive"
                            : trait.impact === "NEUTRAL"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {trait.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {trait.description}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Kategorie: {trait.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        // Ändere die Skills-Karte
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Fähigkeiten</CardTitle>
              <CardDescription>
                Erlernte Fähigkeiten der Kreatur
              </CardDescription>
            </div>
            {creature && (
              <SkillEditor
                creature={creature}
                onSkillAdded={refreshCreatureData}
              />
            )}
          </CardHeader>
          <CardContent>
            {creature.skills.length === 0 ? (
              <p className="text-muted-foreground">
                Keine Fähigkeiten erlernt.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fähigkeit</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Leidenschaft</TableHead>
                    <TableHead>Kategorie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creature.skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">
                        {skill.name}
                      </TableCell>
                      <TableCell>
                        {skill.level} ({skill.getDisplayName()})
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            skill.passion === "BURNING"
                              ? "default"
                              : skill.passion === "MAJOR"
                              ? "secondary"
                              : skill.passion === "MINOR"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {skill.passion}
                        </Badge>
                      </TableCell>
                      <TableCell>{skill.category}</TableCell>
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
                  {creature.goals.map((goal) => (
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
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Attribute</CardTitle>
            <CardDescription>
              Physische, mentale und soziale Eigenschaften
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Physische Attribute */}
              <div>
                <h3 className="font-semibold mb-2">Physisch</h3>
                <div className="space-y-2">
                  {Object.entries(creature.physicalAttributes).map(
                    ([key, attr]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span>{attr.name}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-secondary rounded-full h-2 mr-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${attr.currentValue}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{attr.currentValue}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Mentale Attribute */}
              <div>
                <h3 className="font-semibold mb-2">Mental</h3>
                <div className="space-y-2">
                  {Object.entries(creature.mentalAttributes).map(
                    ([key, attr]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span>{attr.name}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-secondary rounded-full h-2 mr-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${attr.currentValue}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{attr.currentValue}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Soziale Attribute */}
              <div>
                <h3 className="font-semibold mb-2">Sozial</h3>
                <div className="space-y-2">
                  {Object.entries(creature.socialAttributes).map(
                    ([key, attr]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span>{attr.name}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-secondary rounded-full h-2 mr-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${attr.currentValue}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{attr.currentValue}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
