import React from "react";
import { ICreature } from "@/interfaces/ICreature";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GoalsCardProps {
  creature: ICreature;
}

export function GoalsCard({ creature }: GoalsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ziele</CardTitle>
        <CardDescription>Aktuelle Ziele der Kreatur</CardDescription>
      </CardHeader>
      <CardContent>
        {!creature.goals || creature.goals.length === 0 ? (
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
  );
}
