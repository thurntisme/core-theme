import { useState } from 'react';

import { toast } from '@/components/ui/use-toast';

interface Property {
  id: number;
  name: string;
  level: number;
  income: number;
  maintenanceCost: number;
  type?: string;
  position?: { x: number; y: number };
  district?: string;
  terrainEffect?: {
    type: string;
    valueModifier: number;
    description: string;
  };
}

interface User {
  username: string;
  email: string;
  continent: string;
  level: number;
  money: number;
  properties: Property[];
  land: { size: number; value: number };
  lastLogin: string;
}

export function useProperty(initialUser: User | null) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  const handleBuyLand = () => {
    if (!initialUser) return;

    const landCost = initialUser.land.size * 1000;

    if (initialUser.money < landCost) {
      toast({
        title: 'Insufficient funds',
        description: `You need ${landCost} coins to buy more land.`,
        variant: 'destructive',
      });
      return false;
    }

    const newLandSize = initialUser.land.size + 1;
    const updatedUser = {
      ...initialUser,
      money: initialUser.money - landCost,
      land: {
        size: newLandSize,
        value: initialUser.land.value + landCost,
      },
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    toast({
      title: 'Land purchased!',
      description: `You now own ${updatedUser.land.size} plots of land.`,
    });

    return {
      updatedUser,
      newLandSize,
    };
  };

  const getPropertyAtPosition = (
    x: number,
    y: number,
    properties: Property[]
  ): Property | undefined => {
    return properties.find(
      (p) => p.position && p.position.x === x && p.position.y === y
    );
  };

  const handlePropertySelect = (property: Property | null) => {
    setSelectedProperty(property);
    setShowPropertyDetails(!!property);
  };

  return {
    selectedProperty,
    showPropertyDetails,
    handleBuyLand,
    getPropertyAtPosition,
    handlePropertySelect,
  };
}
