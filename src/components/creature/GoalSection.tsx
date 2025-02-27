// src/components/creature/GoalSection.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Goal as GoalIcon,
  Play,
  XCircle,
  Star,
  Trash2,
} from "lucide-react";
import { ICreature } from "@/interfaces/ICreature";
import {
  IGoal,
  GoalStatus,
  GoalType,
  goalDetailsMap,
} from "@/interfaces/IGoal";
import { GoalEditor } from "@/components/form/GoalEditor";
import { Goal } from "@/models/Goal";
import { saveCreature } from "@/lib/creatureManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface GoalSectionProps {
  creature: ICreature;
  onGoalUpdated: () => void;
}

export function GoalSection({ creature, onGoalUpdated }: GoalSectionProps) {
  // Get goal display info based on status
  const getGoalStatusInfo = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.OPEN:
        return {
          icon: <GoalIcon className="h-4 w-4" />,
          color: "bg-secondary text-secondary-foreground",
          label: "Offen",
        };
      case GoalStatus.IN_PROGRESS:
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          color: "bg-blue-500 text-white",
          label: "In Arbeit",
        };
      case GoalStatus.DONE:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-green-500 text-white",
          label: "Erledigt",
        };
      case GoalStatus.FAILED:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "bg-destructive text-destructive-foreground",
          label: "Gescheitert",
        };
      case GoalStatus.REALIZED:
        return {
          icon: <Star className="h-4 w-4" />,
          color: "bg-purple-500 text-white",
          label: "Verwirklicht",
        };
      default:
        return {
          icon: <GoalIcon className="h-4 w-4" />,
          color: "bg-secondary text-secondary-foreground",
          label: "Unbekannt",
        };
    }
  };

  // Function to update goal status
  const updateGoalStatus = (goal: IGoal, newStatus: GoalStatus) => {
    const foundGoal = creature.goals.find((g) => g.id === goal.id);
    if (foundGoal) {
      foundGoal.status = newStatus;

      // If it's realized, set the realization date
      if (newStatus === GoalStatus.REALIZED) {
        foundGoal.realizedDate = new Date();

        // Apply mood bonus
        if (foundGoal.moodEffect && foundGoal.moodEffect > 0) {
          creature.applyThought({
            id: `thought_goal_realized_${foundGoal.id}`,
            name: `Lebensziel verwirklicht: ${
              // Get the human-readable name if it's a GoalType
              Object.values(GoalType).includes(foundGoal.name as GoalType)
                ? goalDetailsMap[foundGoal.name as GoalType]?.description ||
                  foundGoal.name
                : foundGoal.name
            }`,
            moodEffect: foundGoal.moodEffect || 15,
            duration: 60, // Long-lasting happiness (60 days)
            remainingTime: 60,
            stackCount: 1,
            stackLimit: 1,
          });
        }
      }

      saveCreature(creature);
      onGoalUpdated();
    }
  };

  // Function to delete a goal
  const deleteGoal = (goalId: string) => {
    if (
      window.confirm("Bist du sicher, dass du dieses Ziel löschen möchtest?")
    ) {
      creature.goals = creature.goals.filter((g) => g.id !== goalId);
      saveCreature(creature);
      onGoalUpdated();
    }
  };

  // Get the priority label
  const getPriorityLabel = (priority: number) => {
    if (priority >= 10) return "Lebensziel";
    if (priority >= 5) return "Hoch";
    if (priority >= 3) return "Mittel";
    return "Niedrig";
  };

  // Get goal display name (translate from enum if needed)
  const getGoalDisplayName = (goal: IGoal) => {
    // Check if the name is a GoalType enum value
    if (Object.values(GoalType).includes(goal.name as GoalType)) {
      // Return a formatted version of the enum
      return (goal.name as string).replace(/_/g, " ");
    }

    // Otherwise return the name as is
    return goal.name;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ziele</CardTitle>
          <CardDescription>
            Lebensziele und Ambitionen dieser Kreatur
          </CardDescription>
        </div>
        {creature && (
          <GoalEditor creature={creature} onGoalAdded={onGoalUpdated} />
        )}
      </CardHeader>
      <CardContent>
        {creature.goals.length === 0 ? (
          <p className="text-muted-foreground">Keine Ziele definiert.</p>
        ) : (
          <div className="space-y-4">
            {creature.goals.map((goal) => {
              const statusInfo = getGoalStatusInfo(goal.status);

              return (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">
                        {getGoalDisplayName(goal)}
                      </h3>
                      <Badge className={statusInfo.color}>
                        <span className="flex items-center gap-1">
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        Priorität: {getPriorityLabel(goal.priority)}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <GoalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {goal.status !== GoalStatus.IN_PROGRESS && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateGoalStatus(goal, GoalStatus.IN_PROGRESS)
                              }
                            >
                              <Play className="mr-2 h-4 w-4" />
                              <span>Starten</span>
                            </DropdownMenuItem>
                          )}

                          {goal.status !== GoalStatus.DONE &&
                            goal.status !== GoalStatus.REALIZED && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateGoalStatus(goal, GoalStatus.DONE)
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Als erledigt markieren</span>
                              </DropdownMenuItem>
                            )}

                          {goal.status !== GoalStatus.REALIZED &&
                            goal.priority >= 5 && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateGoalStatus(goal, GoalStatus.REALIZED)
                                }
                              >
                                <Star className="mr-2 h-4 w-4" />
                                <span>Als verwirklicht markieren</span>
                              </DropdownMenuItem>
                            )}

                          {goal.status !== GoalStatus.FAILED && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateGoalStatus(goal, GoalStatus.FAILED)
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              <span>Als gescheitert markieren</span>
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => deleteGoal(goal.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Löschen</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="mt-2 text-muted-foreground">
                    {goal.description}
                  </p>

                  {/* Requirements if available */}
                  {goal.requirements && goal.requirements.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Anforderungen:</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {goal.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Progress bar for in-progress goals */}
                  {goal.status === GoalStatus.IN_PROGRESS &&
                    goal.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Fortschritt</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="mt-1 w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                  {/* Realization date for realized goals */}
                  {goal.status === GoalStatus.REALIZED && goal.realizedDate && (
                    <div className="mt-3 text-sm flex gap-2 items-center text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>
                        Verwirklicht am{" "}
                        {new Date(goal.realizedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
