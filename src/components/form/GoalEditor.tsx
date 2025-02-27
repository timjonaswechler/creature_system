// src/components/form/GoalEditor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GoalStatus,
  IGoal,
  GoalType,
  goalDetailsMap,
} from "@/interfaces/IGoal";
import { ICreature } from "@/interfaces/ICreature";
import { v4 as uuidv4 } from "uuid";
import { saveCreature } from "@/lib/creatureManager";
import { Goal } from "@/models/Goal";

interface GoalEditorProps {
  creature: ICreature;
  onGoalAdded: () => void;
}

export function GoalEditor({ creature, onGoalAdded }: GoalEditorProps) {
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState<GoalType>(GoalType.CUSTOM);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("3");
  const [customGoal, setCustomGoal] = useState(false);

  // Handle goal type change
  const handleGoalTypeChange = (value: GoalType) => {
    setGoalType(value);

    if (value === GoalType.CUSTOM) {
      setCustomGoal(true);
      setName("");
      setDescription("");
      setPriority("3");
    } else {
      setCustomGoal(false);
      setName(value);
      const details = goalDetailsMap[value];
      setDescription(details.description);

      // Hier die Priorität entsprechend setzen
      if (details && details.priority) {
        setPriority(details.priority.toString());
      } else {
        // Fallback falls keine Priorität definiert ist
        setPriority("3");
      }
    }
  };

  const handleAddGoal = () => {
    if (!name) return;

    if (customGoal) {
      // Create custom goal
      const newGoal: IGoal = {
        id: uuidv4(),
        name: name,
        description: description,
        priority: parseInt(priority, 10),
        status: GoalStatus.OPEN,
        subgoals: [],
        requirements: [],
        moodEffect: 15, // Default mood effect for custom goals
      };

      // Add the goal to the creature
      creature.goals.push(newGoal);
    } else {
      // Create predefined goal using the Goal class
      const goal = Goal.fromGoalType(goalType);

      // Add the goal to the creature
      creature.goals.push(goal);
    }

    // Save the updated creature
    saveCreature(creature);

    // Reset form and close dialog
    setGoalType(GoalType.CUSTOM);
    setName("");
    setDescription("");
    setPriority("3");
    setOpen(false);

    // Callback for update
    onGoalAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ziel hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ziel hinzufügen</DialogTitle>
          <DialogDescription>
            Füge ein neues Lebensziel für die Kreatur hinzu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="goalType" className="text-right">
              Zieltyp
            </label>
            <Select
              value={goalType}
              onValueChange={(value) => handleGoalTypeChange(value as GoalType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle einen Zieltyp" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GoalType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === GoalType.CUSTOM
                      ? "Benutzerdefiniert"
                      : type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {customGoal && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}

          {customGoal && (
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right">
                Beschreibung
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="priority" className="text-right">
              Priorität
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle eine Priorität" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Niedrig (1)</SelectItem>
                <SelectItem value="3">Mittel (3)</SelectItem>
                <SelectItem value="5">Hoch (5)</SelectItem>
                <SelectItem value="10">Lebensziel (10)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAddGoal}>Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
