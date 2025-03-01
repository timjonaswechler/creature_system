// app/weapons/[id]/page.tsx
"use client";
import { useParams } from "next/navigation";
import { WeaponDetail } from "@/components/weapons/weapon-detail";

export default function WeaponDetailPage() {
  const params = useParams();
  // Die ID sollte automatisch aus der URL extrahiert werden
  return <WeaponDetail />;
}
