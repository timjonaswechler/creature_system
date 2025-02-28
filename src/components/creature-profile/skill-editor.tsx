// src/components/form/SkillEditor.tsx
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
import { SkillCategory, SkillPassion } from "@/types/skill";
import { ICreature } from "@/types/creature";
import { v4 as uuidv4 } from "uuid";
import { Skill } from "@/lib/models/skill";
import { CreatureService } from "@/lib/services/creature-service";

interface SkillEditorProps {
  creature: ICreature;
  onSkillAdded: () => void;
}

export function SkillEditor({ creature, onSkillAdded }: SkillEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SkillCategory>(
    SkillCategory.CRAFTING
  );
  const [passion, setPassion] = useState<SkillPassion>(SkillPassion.NONE);
  const [level, setLevel] = useState("0");

  const handleAddSkill = () => {
    if (!name || !description) return;

    // Erstelle neuen Skill
    const skill = new Skill();
    skill.id = uuidv4();
    skill.name = name;
    skill.description = description;
    skill.category = category;
    skill.passion = passion;
    skill.level = parseInt(level, 10);

    // Füge die entsprechenden Attribute basierend auf der Kategorie hinzu
    // (Vereinfachte Version, sollte später erweitert werden)

    // Füge den Skill zur Kreatur hinzu
    creature.skills.push(skill);

    // Speichere die aktualisierte Kreatur
    CreatureService.saveCreature(creature);

    // Reset form and close dialog
    setName("");
    setDescription("");
    setCategory(SkillCategory.CRAFTING);
    setPassion(SkillPassion.NONE);
    setLevel("0");
    setOpen(false);

    // Callback für Aktualisierung
    onSkillAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Fähigkeit hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fähigkeit hinzufügen</DialogTitle>
          <DialogDescription>
            Füge eine neue Fähigkeit zu deiner Kreatur hinzu.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right">
              Kategorie
            </label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as SkillCategory)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle eine Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SkillCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="passion" className="text-right">
              Passion
            </label>
            <Select
              value={passion}
              onValueChange={(value) => setPassion(value as SkillPassion)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle eine Passion" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SkillPassion).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="level" className="text-right">
              Level
            </label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle ein Level" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 21 }).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAddSkill}>Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
