import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Shield,
  Sword,
  Weight,
  DollarSign,
  Heart,
  Tag,
} from "lucide-react";
import { IWeapon, WeaponType } from "@/types/weapon";
import { WeaponService } from "@/lib/services/weapon-service";

export const WeaponDetail = () => {
  const params = useParams();

  const router = useRouter();
  const [weapon, setWeapon] = useState<IWeapon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      const id = params.id as string;
      console.log("Lade Waffe mit ID:", id);

      WeaponService.getWeaponById(id)
        .then((data) => {
          console.log("Geladene Waffe:", data);
          if (data) {
            setWeapon(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Fehler beim Laden der Waffe:", error);
          setLoading(false);
        });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Waffendetails werden geladen...
      </div>
    );
  }

  if (!weapon) {
    return (
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Waffe nicht gefunden</h1>
          <p className="mb-6">
            Die gesuchte Waffe existiert nicht oder wurde entfernt.
          </p>
          <Button onClick={() => router.push("/weapons")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/weapons")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Zurück zur Übersicht
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hauptinfo-Karte */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{weapon.name}</CardTitle>
                <CardDescription>
                  {weapon.type === WeaponType.MELEE
                    ? "Nahkampfwaffe"
                    : weapon.type === WeaponType.RANGED
                    ? "Fernkampfwaffe"
                    : "Wurfwaffe"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{weapon.description}</p>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Sword className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Schaden:</span>
                  <span className="ml-2">{weapon.baseDamage}</span>
                </div>

                <div className="flex items-center">
                  <Weight className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Gewicht:</span>
                  <span className="ml-2">{weapon.weight} kg</span>
                </div>

                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Preis:</span>
                  <span className="ml-2">{weapon.price} Gold</span>
                </div>

                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Material:</span>
                  <span className="ml-2">{weapon.material}</span>
                </div>

                <div className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Haltbarkeit:</span>
                  <span className="ml-2">{weapon.durability}/100</span>
                </div>

                {weapon.range && (
                  <div className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Reichweite:</span>
                    <span className="ml-2">{weapon.range} m</span>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Eigenschaften:</h3>
                <div className="flex flex-wrap gap-2">
                  {weapon.properties.map((property, index) => (
                    <Badge key={index} variant="outline">
                      {property}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bild und weitere Infos */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vorschau</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {weapon.imageUrl ? (
              <img
                src={weapon.imageUrl}
                alt={weapon.name}
                className="max-w-full max-h-64 object-contain mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center mb-4">
                <Sword className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            <div className="w-full mt-4 space-y-2">
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full"
                  style={{ width: `${weapon.durability}%` }}
                ></div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Zustand: {weapon.durability}/100
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
