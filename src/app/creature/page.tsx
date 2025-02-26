// src/app/creature/page.tsx
import React from "react";
import { CreatureForm } from "@/components/form/CreatureForm";

export default function CreaturePage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Creature Management</h1>
      <p className="mb-6">
        Erstelle und verwalte deine Kreaturen. Alle erstellten Kreaturen werden lokal im Browser gespeichert.
      </p>
      
      <CreatureForm />
              {/* TODO: Hier kommt einen überischt aller Kreaturen. in Tabellarischer Form. */}
              {/* TODO: einen ebnen weiter untern kommt die darstellung einer einzelnen Kreatur über die ID.  */}
              {/* TODO: Speicherung überlegen!! */}
              </div>
  );
}