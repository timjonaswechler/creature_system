"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Weapon = {
  id: number;
  name: string;
  damage: number;
  type: string;
};

export default function WeaponsPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for future API call
    // Example: fetchWeapons().then(data => setWeapons(data))
    setLoading(false);
    // For now, just using mock data
    setWeapons([
      { id: 1, name: "Sword", damage: 10, type: "Melee" },
      { id: 2, name: "Bow", damage: 8, type: "Ranged" },
      { id: 3, name: "Staff", damage: 7, type: "Magic" },
    ]);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Weapons Database</h1>

      {loading ? (
        <div className="flex justify-center">
          <p>Loading weapons...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weapons.map((weapon) => (
              <div
                key={weapon.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold">{weapon.name}</h2>
                <p>Type: {weapon.type}</p>
                <p>Damage: {weapon.damage}</p>
                <Link
                  href={`/weapons/${weapon.id}`}
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/weapons/create"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Create New Weapon
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
