"use client";

import { Table } from "@tanstack/react-table";
import {
  Trash2,
  MoreHorizontal,
  Download,
  Copy,
  UserPlus,
  Share2,
  Heart,
  Swords,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICreature } from "@/types/creature";
import { CreatureService } from "@/lib/services/creature-service";
import { SocialRelationType } from "@/types/social-relation";
import { TraitCategory, TraitImpact } from "@/types/trait";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { SocialRelation } from "@/lib/models/social-relation";

interface HeaderBulkActionsProps {
  table: Table<ICreature>;
  onBulkActionComplete: () => void;
}

export function HeaderBulkActions({
  table,
  onBulkActionComplete,
}: HeaderBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  // Handle bulk delete action
  const handleBulkDelete = () => {
    if (selectedCount === 0) return;

    const confirmMessage =
      selectedCount === 1
        ? "Möchtest du die ausgewählte Kreatur wirklich löschen?"
        : `Möchtest du ${selectedCount} ausgewählte Kreaturen wirklich löschen?`;

    if (window.confirm(confirmMessage)) {
      // Extract ids from selected rows
      const idsToDelete = selectedRows.map((row) => row.original.id);

      // Delete each creature
      idsToDelete.forEach((id) => {
        CreatureService.deleteCreature(id);
      });

      // Reset row selection
      table.resetRowSelection();

      // Notify parent component to refresh data
      onBulkActionComplete();

      // Show success notification
      toast.success(
        selectedCount === 1
          ? "Kreatur wurde gelöscht"
          : `${selectedCount} Kreaturen wurden gelöscht`
      );
    }
  };

  // Create social bonds between all selected creatures
  const createSocialBonds = (relationType: SocialRelationType) => {
    if (selectedCount < 2) {
      toast.error(
        "Wähle mindestens zwei Kreaturen aus, um Beziehungen zu erstellen"
      );
      return;
    }

    // Get array of selected creatures
    const selectedCreatures = selectedRows.map((row) => row.original);

    // Create relationships between all selected creatures
    let relationshipsCreated = 0;

    selectedCreatures.forEach((creature1) => {
      selectedCreatures.forEach((creature2) => {
        // Don't create a relationship with self
        if (creature1.id === creature2.id) return;

        // Skip if relationship already exists
        const existingRelation = creature1.socialRelations.find(
          (rel) => rel.targetId === creature2.id
        );

        if (!existingRelation) {
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
            targetId: creature2.id,
            type: relationType,
            familyDetails,
          });

          // Add relation to creature's social relations
          creature1.socialRelations.push(relation);

          // Save the updated creature
          CreatureService.saveCreature(creature1);

          relationshipsCreated++;
        }
      });
    });

    // Reset row selection
    table.resetRowSelection();

    // Notify parent component to refresh data
    onBulkActionComplete();

    // Show success notification
    toast.success(
      `${relationshipsCreated} Beziehungen vom Typ "${relationType}" wurden erstellt`
    );
  };

  // Export creatures as JSON
  const exportCreatures = () => {
    if (selectedCount === 0) return;

    // Get array of selected creatures
    const selectedCreatures = selectedRows.map((row) => row.original);

    // Convert to JSON string
    const jsonData = JSON.stringify(selectedCreatures, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "creatures-export.json";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show success notification
    toast.success(
      selectedCount === 1
        ? "Kreatur exportiert"
        : `${selectedCount} Kreaturen exportiert`
    );
  };

  // Duplicate selected creatures
  const duplicateCreatures = () => {
    if (selectedCount === 0) return;

    // Get array of selected creatures
    const selectedCreatures = selectedRows.map((row) => row.original);

    // Count successful duplications
    let successCount = 0;

    // Duplicate each creature
    selectedCreatures.forEach((creature) => {
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
        successCount++;
      } catch (error) {
        console.error("Error duplicating creature:", error);
      }
    });

    // Reset row selection
    table.resetRowSelection();

    // Notify parent component to refresh data
    onBulkActionComplete();

    // Show success notification
    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "Kreatur wurde dupliziert"
          : `${successCount} Kreaturen wurden dupliziert`
      );
    } else {
      toast.error("Fehler beim Duplizieren der Kreaturen");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          disabled={selectedCount === 0}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Aktionen Menü</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>
          {selectedCount} {selectedCount === 1 ? "Kreatur" : "Kreaturen"}{" "}
          ausgewählt
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Duplicate creatures */}
        <DropdownMenuItem onClick={duplicateCreatures}>
          <Copy className="mr-2 h-4 w-4" />
          Duplizieren
        </DropdownMenuItem>

        {/* Export creatures */}
        <DropdownMenuItem onClick={exportCreatures}>
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </DropdownMenuItem>

        {/* Create relationships submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
            Beziehungen erstellen
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.FRIEND)}
              >
                Freunde
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  createSocialBonds(SocialRelationType.CLOSE_FRIEND)
                }
              >
                Enge Freunde
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.SIBLING)}
              >
                Geschwister
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.SPOUSE)}
              >
                Ehepartner
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.LOVER)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Liebhaber
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.RIVAL)}
              >
                Rivalen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => createSocialBonds(SocialRelationType.ENEMY)}
              >
                Feinde
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Delete creatures */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleBulkDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
