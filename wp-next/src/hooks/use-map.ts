import { useEffect, useRef, useState } from 'react';

import { districts } from '@/constants/district';
import type { Property, User } from '@/types/world-user';

interface MapState {
  gridSize: number;
  districts: any[];
  mapProperties: Property[];
  zoomLevel: number;
  showDistricts: boolean;
  mapView: 'standard' | 'district' | 'satellite';
  mapPosition: { x: number; y: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
  activeFilters: {
    residential: boolean;
    commercial: boolean;
    industrial: boolean;
  };
}

export function useMap(initialUser: User | null) {
  const [state, setState] = useState<MapState>({
    gridSize: 12,
    districts: [],
    mapProperties: [],
    zoomLevel: 1,
    showDistricts: true,
    mapView: 'standard',
    mapPosition: { x: 0, y: 0 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    activeFilters: {
      residential: true,
      commercial: true,
      industrial: true,
    },
  });

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialUser) {
      const newGridSize = Math.max(
        24,
        Math.ceil(Math.sqrt(initialUser.land.size * 2))
      );
      // const newDistricts = generateDistricts(newGridSize)
      const newDistricts = districts;
      console.log(newDistricts);

      setState((prev) => ({
        ...prev,
        gridSize: newGridSize,
        districts: newDistricts,
        mapProperties: initialUser.properties,
      }));
    }
  }, [initialUser]);

  const handleZoom = (delta: number) => {
    setState((prev) => ({
      ...prev,
      zoomLevel: Math.min(Math.max(prev.zoomLevel + delta, 0.5), 2),
    }));
  };

  const handleDragStart = (e: MouseEvent) => {
    setState((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX, y: e.clientY },
    }));
  };

  const handleDrag = (e: MouseEvent) => {
    if (!state.isDragging) return;

    const dx = e.clientX - state.dragStart.x;
    const dy = e.clientY - state.dragStart.y;

    setState((prev) => ({
      ...prev,
      mapPosition: {
        x: prev.mapPosition.x + dx,
        y: prev.mapPosition.y + dy,
      },
      dragStart: { x: e.clientX, y: e.clientY },
    }));
  };

  const handleDragEnd = () => {
    setState((prev) => ({ ...prev, isDragging: false }));
  };

  const resetPosition = () => {
    setState((prev) => ({
      ...prev,
      mapPosition: { x: 0, y: 0 },
      zoomLevel: 1,
    }));
  };

  const toggleFilter = (filter: keyof typeof state.activeFilters) => {
    setState((prev) => ({
      ...prev,
      activeFilters: {
        ...prev.activeFilters,
        [filter]: !prev.activeFilters[filter],
      },
    }));
  };

  const setMapView = (view: MapState['mapView']) => {
    setState((prev) => ({ ...prev, mapView: view }));
  };

  const toggleDistricts = () => {
    setState((prev) => ({ ...prev, showDistricts: !prev.showDistricts }));
  };

  return {
    ...state,
    mapRef,
    handleZoom,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    resetPosition,
    toggleFilter,
    setMapView,
    toggleDistricts,
  };
}
