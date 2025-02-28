// src/app/creature/page.tsx
"use client";
import { useState, useEffect } from "react";
import { CreatureService } from "@/lib/services/creature-service";
import { ICreature } from "@/types/creature";
import { DataTable } from "./components/data-table";
import { CreatureModal } from "@/components/forms/creature-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreatureExamples } from "./components/creature-example";
import { PlusIcon } from "lucide-react";

export default function CreaturePage() {
  const [creatures, setCreatures] = useState<ICreature[]>([]);

  // Load creatures when component mounts
  useEffect(() => {
    loadCreatures();
  }, []);

  const loadCreatures = () => {
    const storedCreatures = CreatureService.getCreatures();
    setCreatures(Object.values(storedCreatures));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Kreaturen</h2>
        <p className="text-muted-foreground">
          Verwalte deine Kreaturensammlung
        </p>
      </div>

      <div className="flex items-center gap-2">
        <CreatureModal onCreatureCreated={loadCreatures}>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Neue Kreatur erstellen
          </Button>
        </CreatureModal>

        <CreatureExamples onCreaturesCreated={loadCreatures} />

        <div className="flex-1"></div>

        <p className="text-sm text-muted-foreground">
          {creatures.length} {creatures.length === 1 ? "Kreatur" : "Kreaturen"}{" "}
          in der Sammlung
        </p>
      </div>

      <Separator />

      <DataTable data={creatures} onCreatureCreated={loadCreatures} />
    </div>
  );
}
