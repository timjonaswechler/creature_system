"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { HeaderBulkActions } from "./header-bulk-actions";
import { ICreature } from "@/types/creature";
import { TraitImpact } from "@/types/trait";

export const createColumns = (
  onBulkActionComplete: () => void
): ColumnDef<ICreature>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // Check if creature is a favorite
      const isFavorite = row.original.traits?.some(
        (trait) => trait.name === "Favorit" || trait.name === "Favorite"
      );

      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">{row.getValue("name")}</div>
          {isFavorite && (
            <Badge variant="secondary" className="text-amber-500">
              ★
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "birthdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alter" />
    ),
    cell: ({ row }) => {
      const birthdate = new Date(row.original.birthdate);
      const today = new Date();
      const ageInYears = Math.floor(
        (today.getTime() - birthdate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      );

      const formattedDate = birthdate
        ? birthdate.toLocaleDateString()
        : "Unbekannt";

      return (
        <div className="flex flex-col">
          <span>{ageInYears} Jahre</span>
          <span className="text-muted-foreground text-xs">{formattedDate}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "socialRelations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beziehungen" />
    ),
    cell: ({ row }) => {
      const relations = row.original.socialRelations || [];
      return (
        <div>
          {relations.length > 0 ? (
            <Badge>{relations.length} Beziehungen</Badge>
          ) : (
            <span className="text-muted-foreground text-sm">Keine</span>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "skills",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fähigkeiten" />
    ),
    cell: ({ row }) => {
      const skills = row.original.skills || [];
      return (
        <div className="flex flex-wrap gap-1">
          {skills.length > 0 ? (
            skills
              .sort((a, b) => b.level - a.level) // Sortiere nach Level absteigend
              .slice(0, 2) // Zeige die Top 2 Skills
              .map((skill) => (
                <Badge key={skill.id} variant="outline" className="mr-1">
                  {skill.name} {skill.level}
                </Badge>
              ))
          ) : (
            <span className="text-muted-foreground text-sm">Keine</span>
          )}
          {skills.length > 2 && (
            <Badge variant="outline">+{skills.length - 2} mehr</Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "traits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eigenschaften" />
    ),
    cell: ({ row }) => {
      const traits = row.original.traits || [];
      // Filter out the "Favorit" trait for display
      const displayTraits = traits.filter(
        (trait) => trait.name !== "Favorit" && trait.name !== "Favorite"
      );

      return (
        <div className="flex flex-wrap gap-1">
          {displayTraits.length > 0 ? (
            displayTraits.slice(0, 2).map((trait) => (
              <Badge
                key={trait.id}
                variant={
                  trait.impact === TraitImpact.POSITIVE
                    ? "default"
                    : trait.impact === TraitImpact.NEGATIVE
                    ? "destructive"
                    : "outline"
                }
                className="mr-1"
              >
                {trait.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">Keine</span>
          )}
          {displayTraits.length > 2 && (
            <Badge variant="outline">+{displayTraits.length - 2} mehr</Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "mentalStates",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zustand" />
    ),
    cell: ({ row }) => {
      const mentalStates = row.original.mentalStates || [];
      const currentState =
        mentalStates.length > 0 ? mentalStates[0].name : "Normal";
      const isNormal = currentState === "Normal";

      return (
        <div>
          <Badge
            variant={isNormal ? "outline" : "secondary"}
            className={
              !isNormal ? "bg-amber-100 text-amber-800 hover:bg-amber-100" : ""
            }
          >
            {currentState}
          </Badge>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: ({ table }) => (
      <HeaderBulkActions
        table={table}
        onBulkActionComplete={onBulkActionComplete}
      />
    ),
    cell: ({ row }) => (
      <DataTableRowActions row={row} onActionComplete={onBulkActionComplete} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
