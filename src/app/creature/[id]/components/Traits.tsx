import React from "react";
import { ICreature } from "@/interfaces/ICreature";
import { TraitEditor } from "@/components/form/TraitEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TraitsCardProps {
  creature: ICreature;
  onTraitAdded: () => void;
}

export const TraitsCard: React.FC<TraitsCardProps> = ({
  creature,
  onTraitAdded,
}) => {
  return (
    <Card className="col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Eigenschaften</CardTitle>
          <CardDescription>
            Persönliche Eigenschaften dieser Kreatur
          </CardDescription>
        </div>
        {creature && (
          <TraitEditor creature={creature} onTraitAdded={onTraitAdded} />
        )}
      </CardHeader>
      <CardContent>
        {!creature.traits || creature.traits.length === 0 ? (
          <p className="text-muted-foreground">
            Keine Eigenschaften definiert.
          </p>
        ) : (
          //Here we map over the traits of the creature and display them in a list
          <div className="space-y-2">
            {creature.traits.map((trait) => (
              <div key={trait.id} className="p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{trait.name}</div>
                  <Badge
                    variant={
                      trait.impact === "POSITIVE"
                        ? "default"
                        : trait.impact === "NEGATIVE"
                        ? "destructive"
                        : trait.impact === "NEUTRAL"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {trait.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {trait.description}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Kategorie: {trait.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
