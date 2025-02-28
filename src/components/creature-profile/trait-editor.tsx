// src/components/form/TraitEditor.tsx
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
import { TraitCategory, TraitImpact } from "@/types/trait";
import { ICreature } from "@/types/creature";
import { v4 as uuidv4 } from "uuid";
import { Trait } from "@/lib/models/trait";
import { saveCreature } from "@/lib/creatureManager";

interface TraitEditorProps {
  creature: ICreature;
  onTraitAdded: () => void;
}

export function TraitEditor({ creature, onTraitAdded }: TraitEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TraitCategory>(
    TraitCategory.PERSONALITY
  );
  const [impact, setImpact] = useState<TraitImpact>(TraitImpact.NEUTRAL);

  const handleAddTrait = () => {
    if (!name || !description) return;

    // Erstelle neuen Trait
    const trait = new Trait();
    trait.id = uuidv4();
    trait.name = name;
    trait.description = description;
    trait.category = category;
    trait.impact = impact;

    // Füge den Trait zur Kreatur hinzu
    creature.traits.push(trait);

    // Speichere die aktualisierte Kreatur
    saveCreature(creature);

    // Reset form and close dialog
    setName("");
    setDescription("");
    setCategory(TraitCategory.PERSONALITY);
    setImpact(TraitImpact.NEUTRAL);
    setOpen(false);

    // Callback für Aktualisierung
    onTraitAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Trait hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trait hinzufügen</DialogTitle>
          <DialogDescription>
            Füge einen neuen Trait zu deiner Kreatur hinzu.
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
              onValueChange={(value) => setCategory(value as TraitCategory)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle eine Kategorie" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TraitCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="impact" className="text-right">
              Auswirkung
            </label>
            <Select
              value={impact}
              onValueChange={(value) => setImpact(value as TraitImpact)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wähle eine Auswirkung" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TraitImpact).map((imp) => (
                  <SelectItem key={imp} value={imp}>
                    {imp}
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
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleAddTrait}>Hinzufügen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
