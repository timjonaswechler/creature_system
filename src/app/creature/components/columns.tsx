"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { ICreature } from "@/interfaces/ICreature";

export const columns: ColumnDef<ICreature>[] = [
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
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "birthdate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Birthdate" />
    ),
    cell: ({ row }) => {
      const birthdate = row.getValue("birthdate");
      const formattedDate = birthdate
        ? new Date(birthdate as string).toLocaleDateString()
        : "Unknown";
      return <div>{formattedDate}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "skills",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Skills" />
    ),
    cell: ({ row }) => {
      const skills = row.original.skills;
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
            <span className="text-muted-foreground">Keine Skills</span>
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
      <DataTableColumnHeader column={column} title="Traits" />
    ),
    cell: ({ row }) => {
      const traits = row.original.traits;
      return (
        <div className="flex flex-wrap gap-1">
          {traits.length > 0 ? (
            traits.slice(0, 2).map((trait) => (
              <Badge key={trait.id} variant="outline" className="mr-1">
                {trait.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">No traits</span>
          )}
          {traits.length > 2 && (
            <Badge variant="outline">+{traits.length - 2} more</Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "mentalStates",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => {
      const mentalStates = row.original.mentalStates || [];
      return (
        <div>{mentalStates.length > 0 ? mentalStates[0].name : "Normal"}</div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
