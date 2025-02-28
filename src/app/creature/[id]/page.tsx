// src/app/creature/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import { getCreatureById, saveCreature } from "@/lib/creatureManager";
import { ICreature } from "@/types/creature";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AttributesCard } from "@/components/creature-profile/attributes";
import { GoalsCard } from "@/components/creature-profile/goals";
import { SkillsCard } from "@/components/creature-profile/skills";
import { TraitsCard } from "@/components/creature-profile/traits";
import { SocialRelationsCard } from "@/components/creature-profile/social-relations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreatureService } from "@/lib/services/creature-service";

export default function CreatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [creature, setCreature] = useState<ICreature | null>(null);
  const [loading, setLoading] = useState(true);
  // State for updating data
  const [refreshData, setRefreshData] = useState(false);
  // State for the birthdate
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  // Function to update the creature's birthdate
  const updateBirthdate = (date: Date | undefined) => {
    if (date && creature) {
      const updatedCreature = { ...creature, birthdate: date };
      setCreature(updatedCreature);
      CreatureService.saveCreature(updatedCreature);
    }
    setBirthdate(date);
  };

  // Function to refresh creature data
  const refreshCreatureData = () => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundCreature = CreatureService.getCreatureById(id);
      setCreature(foundCreature);
      setBirthdate(
        foundCreature ? new Date(foundCreature.birthdate) : undefined
      );
      setRefreshData((prev) => !prev);
    }
  };

  useEffect(() => {
    if (params.id) {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundCreature = CreatureService.getCreatureById(id);
      setCreature(foundCreature);
      setBirthdate(
        foundCreature ? new Date(foundCreature.birthdate) : undefined
      );
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
        <Card className="col-span-2 lg:col-span-1">
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !birthdate && "text-muted-foreground"
                          )}
                        >
                          {birthdate ? (
                            format(birthdate, "PPP")
                          ) : (
                            <span>Datum auswählen</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={birthdate}
                          onSelect={updateBirthdate}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Mentaler Zustand
                  </TableCell>
                  <TableCell>
                    {creature.mentalStates && creature.mentalStates.length > 0
                      ? creature.mentalStates[0].name
                      : "Normal"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Soziale Beziehungen
                  </TableCell>
                  <TableCell>
                    {creature.socialRelations &&
                    creature.socialRelations.length > 0
                      ? `${creature.socialRelations.length} Beziehungen`
                      : "Keine Beziehungen"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <TraitsCard creature={creature} onTraitAdded={refreshCreatureData} />

        <SkillsCard creature={creature} onSkillAdded={refreshCreatureData} />

        <GoalsCard creature={creature} />

        <AttributesCard creature={creature} />

        {/* Add the SocialRelations component */}
        <SocialRelationsCard creature={creature} />
      </div>
    </div>
  );
}
