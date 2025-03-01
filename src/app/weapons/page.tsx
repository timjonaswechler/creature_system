"use client";
import { useState, useEffect } from "react";
import { WeaponsList } from "@/components/weapons/weapons-list";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sword } from "lucide-react";

export default function WeaponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Waffen</h2>
        <p className="text-muted-foreground">Verwalte den Waffenkatalog</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1"></div>
        <p className="text-sm text-muted-foreground">
          <Sword className="inline mr-1 h-4 w-4" />
          Waffen aus dem Verzeichnis
        </p>
      </div>

      <Separator />

      <WeaponsList />
    </div>
  );
}
