"use client";

import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import {
  ArrowRight,
  Copy,
  Edit,
  Heart,
  MoreHorizontal,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreatureService } from "@/lib/services/creature-service";
import { ICreature } from "@/types/creature";
import { SocialRelationType } from "@/types/social-relation";
import { TraitCategory, TraitImpact } from "@/types/trait";
import { toast } from "sonner";
import { SocialRelation } from "@/lib/models/social-relation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onActionComplete?: () => void;
}

export function DataTableRowActions<TData>({
  row,
  onActionComplete,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const creature = row.original as ICreature;

  // Handle viewing the creature detail
  const handleViewDetail = () => {
    router.push(`/creature/${creature.id}`);
  };

  // Handle deleting a creature
  const handleDelete = () => {
    if (confirm("Bist du sicher, dass du diese Kreatur löschen möchtest?")) {
      CreatureService.deleteCreature(creature.id);

      if (onActionComplete) {
        onActionComplete();
      }

      toast.success("Kreatur wurde gelöscht");
    }
  };

  // Handle duplicating a creature
  const handleDuplicate = () => {
    try {
      // Create a deep copy of the creature
      const newCreature = JSON.parse(JSON.stringify(creature));

      // Generate a new ID and update name
      newCreature.id = crypto.randomUUID();
      newCreature.name = `${creature.name} (Kopie)`;

      // Reset some properties that shouldn't be copied
      newCreature.socialRelations = [];

      // Save the new creature
      CreatureService.saveCreature(newCreature);

      if (onActionComplete) {
        onActionComplete();
      }

      toast.success("Kreatur wurde dupliziert");
    } catch (error) {
      console.error("Error duplicating creature:", error);
      toast.error("Fehler beim Duplizieren der Kreatur");
    }
  };

  // Handle creating a relationship with another creature
  const handleCreateRelationship = (
    targetId: string,
    relationType: SocialRelationType
  ) => {
    try {
      if (targetId === creature.id) {
        toast.error("Eine Kreatur kann keine Beziehung zu sich selbst haben");
        return;
      }

      const targetCreature = CreatureService.getCreatureById(targetId);
      if (!targetCreature) {
        toast.error("Zielkreatur nicht gefunden");
        return;
      }

      // Check if relationship already exists
      const existingRelation = creature.socialRelations.find(
        (rel) => rel.targetId === targetId
      );

      if (existingRelation) {
        toast.info("Diese Beziehung existiert bereits");
        return;
      }

      // Determine appropriate family details
      const familyDetails =
        relationType === SocialRelationType.SPOUSE ||
        relationType === SocialRelationType.LOVER ||
        relationType === SocialRelationType.SIBLING
          ? {
              isBloodRelated: relationType === SocialRelationType.SIBLING,
              generationDifference: 0,
            }
          : relationType === SocialRelationType.PARENT
          ? { isBloodRelated: true, generationDifference: 1 }
          : relationType === SocialRelationType.CHILD
          ? { isBloodRelated: true, generationDifference: -1 }
          : undefined;

      // Create new social relation
      const relation = new SocialRelation({
        targetId,
        type: relationType,
        familyDetails,
      });

      // Create reverse relationship
      const reverseType = getReverseSocialRelationType(relationType);
      const reverseRelation = new SocialRelation({
        targetId: creature.id,
        type: reverseType,
        familyDetails: familyDetails
          ? {
              ...familyDetails,
              generationDifference: -familyDetails.generationDifference,
            }
          : undefined,
      });

      // Add relations
      const updatedCreature = { ...creature };
      updatedCreature.socialRelations.push(relation);
      CreatureService.saveCreature(updatedCreature);

      const updatedTargetCreature = { ...targetCreature };
      updatedTargetCreature.socialRelations.push(reverseRelation);
      CreatureService.saveCreature(updatedTargetCreature);

      if (onActionComplete) {
        onActionComplete();
      }

      toast.success(`Beziehung zu ${targetCreature.name} erstellt`);
    } catch (error) {
      console.error("Error creating relationship:", error);
      toast.error("Fehler beim Erstellen der Beziehung");
    }
  };

  // Helper function to get reverse relationship type
  const getReverseSocialRelationType = (
    type: SocialRelationType
  ): SocialRelationType => {
    switch (type) {
      case SocialRelationType.PARENT:
        return SocialRelationType.CHILD;
      case SocialRelationType.CHILD:
        return SocialRelationType.PARENT;
      case SocialRelationType.SPOUSE:
        return SocialRelationType.SPOUSE;
      case SocialRelationType.LOVER:
        return SocialRelationType.LOVER;
      case SocialRelationType.SIBLING:
        return SocialRelationType.SIBLING;
      case SocialRelationType.FRIEND:
        return SocialRelationType.FRIEND;
      case SocialRelationType.CLOSE_FRIEND:
        return SocialRelationType.CLOSE_FRIEND;
      case SocialRelationType.ENEMY:
        return SocialRelationType.ENEMY;
      case SocialRelationType.GRUDGE:
        return SocialRelationType.GRUDGE;
      case SocialRelationType.RIVAL:
        return SocialRelationType.RIVAL;
      case SocialRelationType.MASTER:
        return SocialRelationType.APPRENTICE;
      case SocialRelationType.APPRENTICE:
        return SocialRelationType.MASTER;
      case SocialRelationType.OWNER:
        return SocialRelationType.PET;
      case SocialRelationType.PET:
        return SocialRelationType.OWNER;
      default:
        return type;
    }
  };

  // Get all other creatures for relationship dropdown
  const getOtherCreatures = (): ICreature[] => {
    const allCreatures = Object.values(getCreatures());
    return allCreatures.filter((c) => c.id !== creature.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Aktionen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={handleViewDetail}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Details anzeigen
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplizieren
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
            Beziehung erstellen
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[200px]">
            {getOtherCreatures().length > 0 ? (
              getOtherCreatures().map((otherCreature) => (
                <DropdownMenuSub key={otherCreature.id}>
                  <DropdownMenuSubTrigger className="w-full">
                    <span className="truncate">{otherCreature.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.FRIEND
                        )
                      }
                    >
                      Freund
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.CLOSE_FRIEND
                        )
                      }
                    >
                      Enger Freund
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.LOVER
                        )
                      }
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Liebhaber
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.SPOUSE
                        )
                      }
                    >
                      Ehepartner
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.PARENT
                        )
                      }
                    >
                      Elternteil von
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.CHILD
                        )
                      }
                    >
                      Kind von
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.SIBLING
                        )
                      }
                    >
                      Geschwister
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.RIVAL
                        )
                      }
                    >
                      Rivale
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCreateRelationship(
                          otherCreature.id,
                          SocialRelationType.ENEMY
                        )
                      }
                    >
                      Feind
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))
            ) : (
              <DropdownMenuItem disabled>
                Keine anderen Kreaturen vorhanden
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Löschen
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get all creatures
function getCreatures(): Record<string, ICreature> {
  try {
    const storedCreatures = localStorage.getItem("creatures");
    if (!storedCreatures) return {};
    return JSON.parse(storedCreatures);
  } catch (error) {
    console.error("Error loading creatures:", error);
    return {};
  }
}
