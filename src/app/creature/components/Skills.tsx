import React from "react";
import { ICreature } from "@/interfaces/ICreature";
import { ISkill, SKILL_LEVEL_NAMES } from "@/interfaces/ISkill";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkillEditor } from "@/components/form/SkillEditor";

interface SkillsCardProps {
  creature: ICreature;
  onSkillAdded: () => void;
}

// Helper function to get skill display name
function getSkillDisplayName(skill: ISkill): string {
  const baseName = SKILL_LEVEL_NAMES[skill.level] || "Legendary";

  // Check if it's a legendary+ skill
  if (skill.level > 16) {
    const plusCount = skill.level - 16;
    return `${baseName}${"+".repeat(plusCount)}`;
  }

  // Check for rust if level is greater than 0
  if (skill.level > 0) {
    const rustFactor = skill.rustCounter / 2;

    if (skill.level >= 4 && rustFactor >= 3) {
      return `${baseName} (V.Rusty)`;
    } else if (rustFactor > 0) {
      return `${baseName} (Rusty)`;
    }
  }

  return baseName;
}

export function SkillsCard({ creature, onSkillAdded }: SkillsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fähigkeiten</CardTitle>
          <CardDescription>Erlernte Fähigkeiten der Kreatur</CardDescription>
        </div>
        <SkillEditor creature={creature} onSkillAdded={onSkillAdded} />
      </CardHeader>
      <CardContent>
        {!creature.skills || creature.skills.length === 0 ? (
          <p className="text-muted-foreground">Keine Fähigkeiten erlernt.</p>
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
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    {skill.level} ({getSkillDisplayName(skill)})
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
  );
}
