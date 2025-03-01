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

      <WeaponsList />
    </div>
  );
}
