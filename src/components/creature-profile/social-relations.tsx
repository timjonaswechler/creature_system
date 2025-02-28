import React, { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ICreature } from "@/types/creature";
import { SocialRelationType, ISocialRelation } from "@/types/social-relation";
import { CreatureService } from "@/lib/services/creature-service";

interface SocialRelationsCardProps {
  creature: ICreature;
}

// Helper function to get a readable relationship type name
function getRelationshipTypeName(type: SocialRelationType): string {
  // Convert enum names to readable format (e.g., CLOSE_FRIEND -> "Close Friend")
  return type
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to determine badge color based on relationship type
function getRelationshipBadgeVariant(
  relation: ISocialRelation
): "default" | "secondary" | "destructive" | "outline" {
  if (
    relation.type === SocialRelationType.ENEMY ||
    relation.type === SocialRelationType.GRUDGE ||
    relation.type === SocialRelationType.RIVAL
  ) {
    return "destructive";
  }

  if (
    relation.type === SocialRelationType.SPOUSE ||
    relation.type === SocialRelationType.LOVER ||
    relation.type === SocialRelationType.FAMILY
  ) {
    return "secondary";
  }

  if (
    relation.type === SocialRelationType.FRIEND ||
    relation.type === SocialRelationType.CLOSE_FRIEND ||
    relation.type === SocialRelationType.KINDRED_SPIRIT
  ) {
    return "secondary";
  }

  return "default";
}

export const SocialRelationsCard: React.FC<SocialRelationsCardProps> = ({
  creature,
}) => {
  // Cache for creature names to avoid repeated lookups
  const [creatureNames, setCreatureNames] = useState<Record<string, string>>(
    {}
  );

  // Get all relationships and sort them by relation type
  const relationships = creature.socialRelations || [];

  useEffect(() => {
    // Load all target creature names on component mount
    const loadCreatureNames = () => {
      const names: Record<string, string> = {};

      relationships.forEach((relation) => {
        const targetCreature = CreatureService.getCreatureById(
          relation.targetId
        );
        if (targetCreature) {
          names[relation.targetId] = targetCreature.name;
        }
      });

      setCreatureNames(names);
    };

    loadCreatureNames();
  }, [relationships]);

  if (relationships.length === 0) {
    return null;
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Soziale Beziehungen</CardTitle>
        <CardDescription>
          {relationships.length} Beziehungen zu anderen Kreaturen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Beziehungstyp</TableHead>
              <TableHead>Wert</TableHead>
              <TableHead>Kompatibilität</TableHead>
              <TableHead>Letzte Interaktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationships.map((relation) => (
              <TableRow key={relation.targetId}>
                <TableCell>
                  {creatureNames[relation.targetId] || relation.targetId}
                </TableCell>
                <TableCell>
                  <Badge variant={getRelationshipBadgeVariant(relation)}>
                    {getRelationshipTypeName(relation.type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {relation.relationshipRank || relation.value}
                </TableCell>
                <TableCell>{relation.compatibility || "N/A"}</TableCell>
                <TableCell>
                  {relation.lastInteraction
                    ? new Date(relation.lastInteraction).toLocaleDateString()
                    : "Unbekannt"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
