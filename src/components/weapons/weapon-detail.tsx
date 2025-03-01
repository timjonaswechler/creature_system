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
  Ruler,
  Target,
  BarChart2,
} from "lucide-react";
import { IWeapon, WeaponType, WeaponCategory } from "@/types/weapon";
import { WeaponService } from "@/lib/services/weapon-service";
import dynamic from "next/dynamic";

// Importiere die RangeChart-Komponente dynamisch
const RangeChart = dynamic(() => import("@/components/weapons/range-chart"), {
  ssr: false,
  loading: () => (
    <div className="h-48 flex items-center justify-center bg-muted rounded-md">
      Lade Reichweitenchart...
    </div>
  ),
});

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

  // Formatierung der Reichweite für die Anzeige
  const getFormattedRange = (): string => {
    if (!weapon.range || weapon.range.size === 0) return "Keine Angabe";

    if (weapon.range.size === 1) {
      const value = Array.from(weapon.range.values())[0];
      return `${value}m`;
    }

    const rangeEntries = Array.from(weapon.range.entries());
    const value = rangeEntries[rangeEntries.length - 1][1];
    return String(value);
  };

  // Formatierung des Schadens für die Anzeige
  const getFormattedDamage = (): string => {
    if (!weapon.baseDamage || weapon.baseDamage.length === 0)
      return "Keine Angabe";

    if (weapon.baseDamage.length === 1) {
      return `${weapon.baseDamage[0]}`;
    }

    return `${weapon.baseDamage[0]}-${weapon.baseDamage[1]}`;
  };

  // Formatierung des Gewichts für die Anzeige
  const getFormattedWeight = (): string => {
    if (!weapon.weight || weapon.weight.length === 0) return "Keine Angabe";

    if (weapon.weight.length === 1) {
      return `${weapon.weight[0]} kg`;
    }

    return `${weapon.weight[0]}-${weapon.weight[1]} kg`;
  };

  // Formatierung des Typs für die Anzeige
  const getWeaponTypeDisplay = (): string => {
    switch (weapon.type) {
      case WeaponType.MELEE:
        return "Nahkampfwaffe";
      case WeaponType.RANGED:
        return "Fernkampfwaffe";
      case WeaponType.THROWING:
        return "Wurfwaffe";
      default:
        return weapon.type;
    }
  };

  // Badge-Farbe basierend auf dem Waffentyp
  const getTypeBadgeColor = (): string => {
    switch (weapon.type) {
      case WeaponType.MELEE:
        return "bg-red-600";
      case WeaponType.RANGED:
        return "bg-sky-600";
      case WeaponType.THROWING:
        return "bg-emerald-600";
      default:
        return "";
    }
  };

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
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <CardTitle className="text-2xl">{weapon.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Badge className={getTypeBadgeColor()}>
                    {getWeaponTypeDisplay()}
                  </Badge>
                  <span className="ml-2">{weapon.category}</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {weapon.material}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{weapon.description}</p>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Schaden:</span>
                  <span className="ml-2">{getFormattedDamage()}</span>
                </div>

                <div className="flex items-center">
                  <Weight className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Gewicht:</span>
                  <span className="ml-2">{getFormattedWeight()}</span>
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

                {weapon.range && weapon.range.size > 0 && (
                  <div className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">max. Reichweite:</span>
                    <span className="ml-2">{getFormattedRange()}</span>
                  </div>
                )}
              </div>

              {/* Reichweiten-Chart (nur wenn Werte vorhanden sind) */}
              {weapon.range && weapon.range.size > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Reichweitenprofil:</h3>
                  <div className="border rounded-md p-4 bg-card">
                    <RangeChart range={weapon.range} />
                  </div>
                </div>
              )}

              <Separator />

              {/* Waffen-Eigenschaften */}
              {weapon.properties && weapon.properties.length > 0 && (
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
              )}

              {/* Waffenspezifische Informationen basierend auf dem Typ */}
              {weapon.type === WeaponType.MELEE && (
                <div>
                  <h3 className="font-medium mb-2">Nahkampf-Details:</h3>
                  <p className="text-sm text-muted-foreground">
                    Diese Nahkampfwaffe kann in direktem Kontakt mit Gegnern
                    eingesetzt werden. Sie ist besonders effektiv gegen{" "}
                    {weapon.category === WeaponCategory.AXES ||
                    weapon.category === WeaponCategory.SWORDS
                      ? "ungepanzerte Gegner"
                      : weapon.category === WeaponCategory.HAMMERS ||
                        weapon.category === WeaponCategory.MACES
                      ? "gepanzerte Gegner"
                      : "verschiedene Gegnertypen"}
                    .
                  </p>
                </div>
              )}

              {weapon.type === WeaponType.RANGED && (
                <div>
                  <h3 className="font-medium mb-2">Fernkampf-Details:</h3>
                  <p className="text-sm text-muted-foreground">
                    Diese Fernkampfwaffe erlaubt Angriffe aus sicherer Distanz.
                    {weapon.category === WeaponCategory.BOWS
                      ? " Bögen erfordern Pfeile als Munition und eine ruhige Hand für präzise Schüsse."
                      : weapon.category === WeaponCategory.CROSSBOWS
                      ? " Armbrüste bieten hohe Präzision und Durchschlagskraft, benötigen aber Zeit zum Nachladen."
                      : weapon.category === WeaponCategory.FIREARMS
                      ? " Feuerwaffen verursachen großen Schaden mit einer explosiven Ladung, sind aber langsam nachzuladen."
                      : " Diese Fernkampfwaffe hat einzigartige Eigenschaften."}
                  </p>
                </div>
              )}

              {weapon.type === WeaponType.THROWING && (
                <div>
                  <h3 className="font-medium mb-2">Wurfwaffen-Details:</h3>
                  <p className="text-sm text-muted-foreground">
                    Diese Wurfwaffe kann auf Distanz eingesetzt werden und
                    verursacht
                    {weapon.category === WeaponCategory.THROWING_WEAPONS
                      ? " mittleren bis hohen Schaden. Nach dem Wurf muss die Waffe eingesammelt oder ersetzt werden."
                      : weapon.category === WeaponCategory.THROWABLE_ITEMS
                      ? " spezielle Effekte oder Flächenschaden. Diese Gegenstände sind in der Regel Verbrauchsmaterial."
                      : " verschiedene Arten von Schaden je nach Ziel und Wurfstil."}
                  </p>
                </div>
              )}
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
                {weapon.type === WeaponType.MELEE ? (
                  <Sword className="h-16 w-16 text-muted-foreground" />
                ) : weapon.type === WeaponType.RANGED ? (
                  <Target className="h-16 w-16 text-muted-foreground" />
                ) : (
                  <Tag className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
            )}

            <div className="w-full mt-4 space-y-2">
              <h3 className="font-medium mb-2 text-center">Zustand</h3>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    weapon.durability > 75
                      ? "bg-green-500"
                      : weapon.durability > 50
                      ? "bg-yellow-500"
                      : weapon.durability > 25
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${weapon.durability}%` }}
                ></div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {weapon.durability}/100
                {weapon.durability > 90
                  ? " (Ausgezeichnet)"
                  : weapon.durability > 75
                  ? " (Gut)"
                  : weapon.durability > 50
                  ? " (Gebraucht)"
                  : weapon.durability > 25
                  ? " (Abgenutzt)"
                  : " (Stark beschädigt)"}
              </p>
            </div>

            {/* Einsatzgebiete */}
            <div className="w-full mt-8">
              <h3 className="font-medium mb-2">Einsatzgebiete</h3>
              <div className="space-y-2">
                <Badge
                  className="w-full justify-center py-1"
                  variant={
                    weapon.type === WeaponType.MELEE ? "default" : "outline"
                  }
                >
                  Nahkampf
                </Badge>
                <Badge
                  className="w-full justify-center py-1"
                  variant={
                    weapon.type === WeaponType.RANGED ? "default" : "outline"
                  }
                >
                  Fernkampf
                </Badge>
                <Badge
                  className="w-full justify-center py-1"
                  variant={
                    weapon.type === WeaponType.THROWING ? "default" : "outline"
                  }
                >
                  Distanzangriff
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
