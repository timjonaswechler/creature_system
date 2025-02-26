"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createNewCreature, saveCreature } from "@/lib/creatureManager"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const formSchema = z.object({
  race: z.string().min(1, "Bitte wähle eine Rasse aus"),
  name: z.string().min(1, "Bitte gib einen Namen ein")
});

type CreatureModalProps = {
  onCreatureCreated?: () => void;
}

export function CreatureModal({ onCreatureCreated }: CreatureModalProps) {
  const [open, setOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)
  
  const races = [
    { label: "Mensch", value: "human" },
    { label: "Elf", value: "elf" },
    { label: "Zwerg", value: "dwarf" },
    { label: "Ork", value: "orc" },
    { label: "Halbling", value: "halfling" },
    { label: "Gnom", value: "gnome" },
    { label: "Halbelf", value: "half-elf" },
    { label: "Halbork", value: "half-orc" },
    { label: "Dragonborn", value: "dragonborn" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      race: "",
      name: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Kreatur erstellen und speichern
      const newCreature = createNewCreature(values.name);
      // In einer realen Anwendung würde man hier zusätzlich die Rasse speichern
      // z.B. newCreature.race = values.race;
      saveCreature(newCreature);
      
      // Modal schließen und zurücksetzen
      setOpen(false);
      form.reset();
      
      // Callback aufrufen, falls vorhanden
      if (onCreatureCreated) {
        onCreatureCreated();
      }
    } catch (error) {
      console.error("Fehler beim Erstellen der Kreatur", error);
    }
  }

  const selectedRace = form.watch("race");
  const selectedRaceLabel = races.find(race => race.value === selectedRace)?.label || "Rasse auswählen";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Neue Kreatur erstellen</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Kreatur erstellen</DialogTitle>
          <DialogDescription>
            Gib die Details für deine neue Kreatur ein.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="race" className="text-sm font-medium">
              Rasse
            </label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="race"
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                  type="button" // Wichtig: Verhindert Submit
                >
                  {selectedRaceLabel}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <ScrollArea className="h-60">
                  <div className="p-1">
                    {races.map((race) => (
                      <div
                        key={race.value}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                          race.value === selectedRace ? "bg-accent text-accent-foreground" : ""
                        )}
                        onClick={() => {
                          form.setValue("race", race.value, { shouldValidate: true });
                          setPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            race.value === selectedRace ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {race.label}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">Wähle die Rasse deiner Kreatur.</p>
            {form.formState.errors.race && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.race.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Name der Kreatur"
              {...form.register("name")}
            />
            <p className="text-sm text-muted-foreground">Der Name deiner Kreatur.</p>
            {form.formState.errors.name && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit">Kreatur erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}