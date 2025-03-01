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
import { Separator } from "@/components/ui/separator";
import {
  Sword,
  Filter,
  ChevronDown,
  ArrowUpDown,
  CirclePlus,
  X,
} from "lucide-react";
import { IWeapon, WeaponType, WeaponCategory } from "@/types/weapon";
import { WeaponService } from "@/lib/services/weapon-service";

export const WeaponsList = () => {
  const [weapons, setWeapons] = useState<IWeapon[]>([]);
  const [filteredWeapons, setFilteredWeapons] = useState<IWeapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGrasp, setSelectedGrasp] = useState<string[]>([]);

  useEffect(() => {
    console.log("Versuche Waffen zu laden...");

    WeaponService.getWeapons()
      .then((data) => {
        console.log("Geladene Waffen:", data);
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
    // Filtern der Waffen basierend auf Suchbegriff und Filtern
    let result = weapons;

    if (searchQuery) {
      result = result.filter(
        (weapon) =>
          weapon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          weapon.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((weapon) => selectedTypes.includes(weapon.type));
    }

    if (selectedCategories.length > 0) {
      result = result.filter((weapon) =>
        selectedCategories.includes(weapon.category)
      );
    }

    if (selectedGrasp.length > 0) {
      result = result.filter((weapon) =>
        weapon.grasp.some((g) => selectedGrasp.includes(g))
      );
    }

    setFilteredWeapons(result);
  }, [searchQuery, selectedTypes, selectedCategories, selectedGrasp, weapons]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedTypes((current) => {
      if (current.includes(type)) {
        return current.filter((t) => t !== type);
      } else {
        return [...current, type];
      }
    });
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((c) => c !== category);
      } else {
        return [...current, category];
      }
    });
  };

  const handleGraspFilter = (grasp: string) => {
    setSelectedGrasp((current) => {
      if (current.includes(grasp)) {
        return current.filter((g) => g !== grasp);
      } else {
        return [...current, grasp];
      }
    });
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedGrasp([]);
    setSearchQuery("");
  };

  const getDisplayableRange = (range?: Map<number, number>): string => {
    console.log("Range:", range);
    if (!range || range.size === 0) return "N/A";

    // Falls nur ein Wert vorhanden ist
    if (range.size === 1) {
      const value = Array.from(range.values())[0];
      return `${value} m`;
    }

    // Falls zwei Werte vorhanden sind (z.B. Präzision/Distanz)
    const values = Array.from(range.values());
    // Wir verwenden den höchsten Wert als Reichweite für die vereinfachte Ansicht
    return `${Math.max(...values)} m`;
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Waffen suchen..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <CirclePlus className="mr-2 h-4 w-4" />
              Typ
              {selectedTypes.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedTypes.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedTypes.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedTypes.length} ausgewählt
                      </Badge>
                    ) : (
                      selectedTypes.map((type) => (
                        <Badge
                          variant="secondary"
                          key={type}
                          className="rounded-sm px-1 font-normal"
                        >
                          {type === WeaponType.MELEE
                            ? "Nahkampf"
                            : type === WeaponType.RANGED
                            ? "Fernkampf"
                            : "Wurf"}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleTypeFilter(WeaponType.MELEE)}
            >
              <div
                className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                  selectedTypes.includes(WeaponType.MELEE)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                }`}
              >
                <X className="h-3 w-3" />
              </div>
              Nahkampfwaffen
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTypeFilter(WeaponType.RANGED)}
            >
              <div
                className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                  selectedTypes.includes(WeaponType.RANGED)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                }`}
              >
                <X className="h-3 w-3" />
              </div>
              Fernkampfwaffen
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleTypeFilter(WeaponType.THROWING)}
            >
              <div
                className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                  selectedTypes.includes(WeaponType.THROWING)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                }`}
              >
                <X className="h-3 w-3" />
              </div>
              Wurfwaffen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <CirclePlus className="mr-2 h-4 w-4" />
              Kategorie
              {selectedCategories.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedCategories.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedCategories.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedCategories.length} ausgewählt
                      </Badge>
                    ) : (
                      selectedCategories.map((category) => (
                        <Badge
                          variant="secondary"
                          key={category}
                          className="rounded-sm px-1 font-normal"
                        >
                          {category}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Object.values(WeaponCategory).map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => handleCategoryFilter(category)}
              >
                <div
                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                    selectedCategories.includes(category)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  }`}
                >
                  <X className="h-3 w-3" />
                </div>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 border-dashed">
              <CirclePlus className="mr-2 h-4 w-4" />
              Griff
              {selectedGrasp.length > 0 && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {selectedGrasp.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedGrasp.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {selectedGrasp.length} ausgewählt
                      </Badge>
                    ) : (
                      selectedGrasp.map((category) => (
                        <Badge
                          variant="secondary"
                          key={category}
                          className="rounded-sm px-1 font-normal"
                        >
                          {category}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["Einhändig", "Zweihändig", "Vielseitig"].map((grasp) => (
              <DropdownMenuItem
                key={grasp}
                onClick={() => handleGraspFilter(grasp)}
              >
                <div
                  className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                    selectedGrasp.includes(grasp)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  }`}
                >
                  <X className="h-3 w-3" />
                </div>
                {grasp}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {(selectedTypes.length > 0 ||
          selectedGrasp.length > 0 ||
          searchQuery) && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table className="rounded-md">
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
                onClick={() => (window.location.href = `/weapons/${weapon.id}`)}
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
                <TableCell>
                  <Badge
                    className={
                      //MELLEE
                      weapon.category === WeaponCategory.DAGGERS
                        ? "bg-red-600"
                        : weapon.category === WeaponCategory.SWORDS
                        ? "bg-orange-600"
                        : weapon.category === WeaponCategory.MACES
                        ? "bg-amber-600"
                        : weapon.category === WeaponCategory.SPEARS
                        ? "bg-yellow-600"
                        : weapon.category === WeaponCategory.AXES
                        ? "bg-lime-600"
                        : weapon.category === WeaponCategory.FLAILS
                        ? "bg-green-600"
                        : weapon.category === WeaponCategory.CLEAVERS
                        ? "bg-emerald-600"
                        : weapon.category === WeaponCategory.HAMMERS
                        ? "bg-teal-600"
                        : weapon.category === WeaponCategory.POLEARMS
                        ? "bg-cyan-600"
                        : weapon.category === WeaponCategory.BOWS
                        ? "bg-sky-600"
                        : weapon.category === WeaponCategory.CROSSBOWS
                        ? "bg-blue-600"
                        : weapon.category === WeaponCategory.FIREARMS
                        ? "bg-violet-600"
                        : weapon.category === WeaponCategory.THROWING_WEAPONS
                        ? "bg-purple-600"
                        : "bg-fuchsia-600"
                    }
                  >
                    {weapon.category}
                  </Badge>
                </TableCell>

                {/* Waffen Schaden */}
                <TableCell>
                  {weapon.baseDamage && weapon.baseDamage.length > 0
                    ? weapon.baseDamage.length > 1
                      ? `${weapon.baseDamage[0]}-${weapon.baseDamage[1]}`
                      : weapon.baseDamage[0]
                    : "N/A"}
                </TableCell>

                {/* Waffen Reichweite */}
                <TableCell>{getDisplayableRange(weapon.range)}</TableCell>

                {/* Waffen Gewicht */}
                <TableCell>
                  {weapon.weight && weapon.weight.length > 0
                    ? weapon.weight.length > 1
                      ? `${weapon.weight[0]}-${weapon.weight[1]} kg`
                      : `${weapon.weight[0]} kg`
                    : "N/A"}
                </TableCell>

                {/* Preis */}
                <TableCell>{weapon.price || "N/A"}</TableCell>

                {/* Material */}
                <TableCell>{weapon.material || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WeaponsList;
