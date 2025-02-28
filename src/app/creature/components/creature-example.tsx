"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  Swords,
  Book,
  Hammer,
  Heart,
  Sparkles,
  Leaf,
  Loader2,
  Baby,
} from "lucide-react";
import { CreatureService } from "@/lib/services/creature-service";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface CreatureExamplesProps {
  onCreaturesCreated: () => void;
}

export function CreatureExamples({
  onCreaturesCreated,
}: CreatureExamplesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);

  // Create basic humanoid
  const createBasicHumanoid = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Humanoid...");

    try {
      const humanoid = CreatureService.createCreature("Humanoid");
      onCreaturesCreated();
      toast.success("Humanoid erstellt", {
        description: "Ein neuer Humanoid wurde erstellt",
      });
    } catch (error) {
      console.error("Error creating humanoid:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen des Humanoid",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a basic family unit (parents + child)
  const createFamily = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Familie...");

    try {
      const family = CreatureService.createFamily();

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Familie erstellt", {
        description:
          "Eine neue Familie mit sozialen Beziehungen wurde erstellt",
      });
    } catch (error) {
      console.error("Error creating family:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Familie",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of warriors
  const createWarriorGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Krieger-Gruppe...");

    try {
      const group = CreatureService.createWarriorGroup(10, 4);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Krieger-Gruppe erstellt", {
        description: `Ein Anführer und ${group.followers.length} Krieger wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating warrior group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Krieger-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of scholars
  const createScholarGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Gelehrten-Gruppe...");

    try {
      const group = CreatureService.createScholarGroup(10, 4);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Gelehrten-Gruppe erstellt", {
        description: `Ein Meister und ${group.apprentices.length} Gelehrte wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating scholar group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Gelehrten-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of craftsmen
  const createCraftsmenGroup = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Handwerker-Gruppe...");

    try {
      const group = CreatureService.createCraftsmenGroup(10, 4);

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Handwerker-Gruppe erstellt", {
        description: `Ein Meister und ${group.apprentices.length} Handwerker wurden erstellt`,
      });
    } catch (error) {
      console.error("Error creating craftsmen group:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Handwerker-Gruppe",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a romantic couple
  const createCouple = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Liebespaar...");

    try {
      const couple = CreatureService.createRomanticCouple();

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Liebespaar erstellt", {
        description: "Ein Paar mit romantischer Beziehung wurde erstellt",
      });
    } catch (error) {
      console.error("Error creating couple:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen des Liebespaars",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of magical beings
  const createMagicalBeings = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle magische Wesen...");

    try {
      const magicalGroup = CreatureService.createMagicalBeings();

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Magische Wesen erstellt", {
        description:
          "Ein Zauberer, ein Lehrling und ein Vertrauter wurden erstellt",
      });
    } catch (error) {
      console.error("Error creating magical beings:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der magischen Wesen",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  // Create a group of nature creatures
  const createNatureCreatures = async () => {
    setIsLoading(true);
    setCurrentTask("Erstelle Naturwesen...");

    try {
      const natureGroup = CreatureService.createNatureBeings();

      // Notify parent component
      onCreaturesCreated();

      // Show success notification
      toast.success("Naturwesen erstellt", {
        description:
          "Ein Druide, ein Waldläufer und ein Tiergefährte wurden erstellt",
      });
    } catch (error) {
      console.error("Error creating nature creatures:", error);
      toast.error("Fehler", {
        description: "Fehler beim Erstellen der Naturwesen",
      });
    } finally {
      setIsLoading(false);
      setCurrentTask(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {currentTask || "Wird geladen..."}
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Beispiel-Kreaturen
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Humanoid</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createBasicHumanoid}>
          <UserPlus className="mr-2 h-4 w-4" />
          Humanoid erstellen
        </DropdownMenuItem>
        <DropdownMenuLabel>Gruppenvorlagen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createFamily}>
          <Baby className="mr-2 h-4 w-4" />
          Familie erstellen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createWarriorGroup}>
          <Swords className="mr-2 h-4 w-4" />
          Krieger-Gruppe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createScholarGroup}>
          <Book className="mr-2 h-4 w-4" />
          Gelehrten-Gruppe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createCraftsmenGroup}>
          <Hammer className="mr-2 h-4 w-4" />
          Handwerker-Gruppe
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Spezielle Kreaturen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createCouple}>
          <Heart className="mr-2 h-4 w-4" />
          Liebespaar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createMagicalBeings}>
          <Sparkles className="mr-2 h-4 w-4" />
          Magische Wesen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createNatureCreatures}>
          <Leaf className="mr-2 h-4 w-4" />
          Naturwesen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
