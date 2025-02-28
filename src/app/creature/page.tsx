// src/app/creature/page.tsx
"use client";
import { useState, useEffect } from "react";
import { getCreatures, saveCreature } from "@/lib/creatureManager";
import { ICreature } from "@/interfaces/ICreature";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { CreatureModal } from "@/components/form/CreatureModal";
import { Button } from "@/components/ui/button";
import { createFamilyUnit } from "@/lib/socialSimulation";
import { toast } from "sonner"; // Change this import
import { UserPlus } from "lucide-react";

export default function CreaturePage() {
  const [creatures, setCreatures] = useState<ICreature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Remove the destructuring of useToast

  // Load creatures when component mounts
  useEffect(() => {
    loadCreatures();
  }, []);

  const loadCreatures = () => {
    const storedCreatures = getCreatures();
    setCreatures(Object.values(storedCreatures));
  };

  const loadSocialRelations = async () => {
    setIsLoading(true);
    try {
      // Create the family unit
      const family = createFamilyUnit();
      // Save each family member to storage
      saveCreature(family.father);
      saveCreature(family.mother);
      saveCreature(family.child);
      // Reload creatures list to show the new family members
      loadCreatures();
      // Show success message using Sonner's toast
      toast.success("Family Created", {
        description: "A new family with social relationships has been created",
      });
    } catch (error) {
      console.error("Error creating family:", error);
      toast.error("Error", {
        description: "Failed to create family with social relationships",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Creatures</h2>
          <p className="text-muted-foreground">
            Manage your creature collection
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadSocialRelations}
            disabled={isLoading}
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Creating Family..." : "Create Family Unit"}
          </Button>
          <CreatureModal onCreatureCreated={loadCreatures} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={creatures}
        onCreatureCreated={loadCreatures}
      />
    </div>
  );
}
