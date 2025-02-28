import React from "react";
import { ICreature } from "@/types/creature";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AttributesCardProps {
  creature: ICreature;
}

export function AttributesCard({ creature }: AttributesCardProps) {
  return (
    <Card className="md:col-span-2 col-span-1">
      <CardHeader>
        <CardTitle>Attribute</CardTitle>
        <CardDescription>
          Physische, mentale und soziale Eigenschaften
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 ">
          {/* Physische Attribute */}
          <div className="flex-1  min-w-80 ">
            <h3 className="font-semibold mb-2">Physisch</h3>
            <div className="space-y-2">
              {creature.physicalAttributes &&
                Object.entries(creature.physicalAttributes).map(
                  ([key, attr]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <span>{attr.name}</span>
                      <div className="flex items-center">
                        <div className="w-28 bg-secondary rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${attr.currentValue}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{attr.currentValue}</span>
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>

          {/* Mentale Attribute */}
          <div className="flex-1  md:min-w-80 ">
            <h3 className="font-semibold mb-2">Mental</h3>
            <div className="space-y-2">
              {creature.mentalAttributes &&
                Object.entries(creature.mentalAttributes).map(([key, attr]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span>{attr.name}</span>
                    <div className="flex items-center">
                      <div className="w-28 bg-secondary rounded-full h-2 mr-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${attr.currentValue}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{attr.currentValue}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Soziale Attribute */}
          <div className="flex-1  md:min-w-80 ">
            <h3 className="font-semibold mb-2">Sozial</h3>
            <div className="space-y-2">
              {creature.socialAttributes &&
                Object.entries(creature.socialAttributes).map(([key, attr]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span>{attr.name}</span>
                    <div className="flex items-center">
                      <div className="w-28 bg-secondary rounded-full h-2 mr-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${attr.currentValue}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{attr.currentValue}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
