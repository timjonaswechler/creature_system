import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sword, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { IWeapon, WeaponType } from "@/types/weapon";
import { WeaponService } from "@/lib/services/weapon-service";

export const WeaponsList = () => {
  const [weapons, setWeapons] = useState<IWeapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<IWeapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    // Log hinzufügen, um zu sehen, ob die Funktion aufgerufen wird
    console.log("Versuche Waffen zu laden...");

    WeaponService.getWeapons()
      .then((data) => {
        console.log("Geladene Waffen:", data); // Schauen, was geladen wurde
        setWeapons(data);
        setFilteredWeapons(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading weapons:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filtern der Waffen basierend auf Suchbegriff und ausgewähltem Typ
    let result = weapons;

    if (searchQuery) {
      result = result.filter(
        (weapon) =>
          weapon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          weapon.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType) {
      result = result.filter((weapon) => weapon.type === selectedType);
    }

    setFilteredWeapons(result);
  }, [searchQuery, selectedType, weapons]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Waffen werden geladen...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Waffen suchen..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTypeFilter(null)}>
                Alle Typen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleTypeFilter(WeaponType.MELEE)}
              >
                Nahkampfwaffen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTypeFilter(WeaponType.RANGED)}
              >
                Fernkampfwaffen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTypeFilter(WeaponType.THROWING)}
              >
                Wurfwaffen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredWeapons.length}{" "}
          {filteredWeapons.length === 1 ? "Waffe" : "Waffen"} gefunden
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sword className="mr-2 h-5 w-5" />
            Waffenverzeichnis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Schaden</TableHead>
                <TableHead>Reichweite</TableHead>
                <TableHead>Gewicht</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Material</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWeapons.map((weapon) => (
                <TableRow
                  key={weapon.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    (window.location.href = `/weapons/${weapon.id}`)
                  }
                >
                  {/* Waffen Name */}
                  <TableCell className="font-medium">{weapon.name}</TableCell>

                  {/* Waffen Type */}
                  <TableCell>
                    <Badge
                      className={
                        weapon.type === WeaponType.MELEE
                          ? "bg-red-600"
                          : weapon.type === WeaponType.RANGED
                          ? "bg-sky-600"
                          : "bg-emerald-600"
                      }
                    >
                      {weapon.type === WeaponType.MELEE
                        ? "Nahkampf"
                        : weapon.type === WeaponType.RANGED
                        ? "Fernkampf"
                        : "Wurf"}
                    </Badge>
                  </TableCell>

                  {/* Waffen Kategorie */}
                  <TableCell className="font-medium">
                    {weapon.category}
                  </TableCell>

                  {/* Waffen Schaden */}
                  <TableCell>
                    {!weapon.baseDamage || !weapon.baseDamage.length
                      ? "undefined"
                      : weapon.baseDamage[0]}{" "}
                    {weapon.baseDamage && weapon.baseDamage.length > 1
                      ? `- ${weapon.baseDamage[1]}`
                      : ""}
                  </TableCell>

                  {/* Waffen Reichweite */}
                  <TableCell>
                    {!weapon.range
                      ? "N/A"
                      : weapon.range.size === 1
                      ? `${weapon.range.get(0) || weapon.range.get(1)}`
                      : weapon.range.size > 1
                      ? `${weapon.range.get(
                          0
                        )} (Präzision) / ${weapon.range.get(1)} (Distanz)`
                      : Array.from(weapon.range.values()).join(" / ")}
                  </TableCell>

                  <TableCell>
                    {!weapon.weight || !weapon.weight.length
                      ? "undefined"
                      : weapon.weight[0]}{" "}
                    {weapon.weight && weapon.weight.length > 1
                      ? `- ${weapon.weight[1]} kg`
                      : ""}
                  </TableCell>
                  <TableCell>{weapon.price}</TableCell>
                  {/* Material */}
                  <TableCell>{weapon.material}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeaponsList;
