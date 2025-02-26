"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { createNewCreature, saveCreature } from "@/lib/creatureManager";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  race: z.string().min(1, "Bitte wähle eine Rasse aus"),
  name: z.string().min(1, "Bitte gib einen Namen ein"),
});

type CreatureModalProps = {
  onCreatureCreated?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
};

export function CreatureModal({
  onCreatureCreated,
  isOpen,
  onOpenChange,
  children,
}: CreatureModalProps) {
  const [open, setOpen] = useState(false);

  // Control open state based on props
  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  // Handle open change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

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
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Kreatur erstellen und speichern
      const newCreature = createNewCreature(values.name);
      // In einer realen Anwendung würde man hier zusätzlich die Rasse speichern
      // z.B. newCreature.race = values.race;
      saveCreature(newCreature);

      // Modal schließen und zurücksetzen
      handleOpenChange(false);
      form.reset();

      // Callback aufrufen, falls vorhanden
      if (onCreatureCreated) {
        onCreatureCreated();
      }
    } catch (error) {
      console.error("Fehler beim Erstellen der Kreatur", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {!children && (
        <DialogTrigger asChild>
          <Button>Neue Kreatur erstellen</Button>
        </DialogTrigger>
      )}

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  onClick={(e) => e.preventDefault()}
                >
                  {form.watch("race")
                    ? races.find((race) => race.value === form.watch("race"))
                        ?.label
                    : "Rasse auswählen"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="max-h-[200px] overflow-auto">
                  {races.map((race) => (
                    <div
                      key={race.value}
                      onClick={() => {
                        form.setValue("race", race.value, {
                          shouldValidate: true,
                        });
                      }}
                      className={cn(
                        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        race.value === form.watch("race")
                          ? "bg-accent text-accent-foreground"
                          : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          race.value === form.watch("race")
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {race.label}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              Wähle die Rasse deiner Kreatur.
            </p>
            {form.formState.errors.race && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.race.message}
              </p>
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
            <p className="text-sm text-muted-foreground">
              Der Name deiner Kreatur.
            </p>
            {form.formState.errors.name && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Kreatur erstellen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
