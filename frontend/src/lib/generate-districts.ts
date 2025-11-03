export interface Point {
  x: number;
  y: number;
}

export interface TerrainFeature {
  id: string;
  type: 'river' | 'mountain' | 'forest' | 'field';
  color: string;
  description: string;
  boundaries: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  properties?: {
    isPassable?: boolean;
    isBuildable?: boolean;
    propertyValueModifier?: number;
  };
}

export interface District {
  id: string;
  name: string;
  color: string;
  description: string;
  boundaries: Point[];
  boundingBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  terrainFeatures: TerrainFeature[];
}

const generateTerrainFeatures = (area: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): TerrainFeature[] => {
  const width = area.endX - area.startX;
  const height = area.endY - area.startY;

  const features: TerrainFeature[] = [];

  // Add mountains
  if (Math.random() > 0.7) {
    features.push({
      id: 'mountain-' + Math.random().toString(36).substr(2, 9),
      type: 'mountain',
      color: 'rgba(120, 113, 108, 0.3)',
      description: 'Majestic mountains with scenic views',
      boundaries: {
        startX: area.startX + Math.floor(width * 0.6),
        startY: area.startY + Math.floor(height * 0.2),
        endX: area.startX + Math.floor(width * 0.8),
        endY: area.startY + Math.floor(height * 0.4),
      },
      properties: {
        isPassable: false,
        isBuildable: false,
        propertyValueModifier: 1.3,
      },
    });
  }

  // Add forest
  if (Math.random() > 0.4) {
    features.push({
      id: 'forest-' + Math.random().toString(36).substr(2, 9),
      type: 'forest',
      color: 'rgba(34, 197, 94, 0.3)',
      description: 'Dense forest area with natural wildlife',
      boundaries: {
        startX: area.startX + Math.floor(width * 0.4),
        startY: area.startY + Math.floor(height * 0.5),
        endX: area.startX + Math.floor(width * 0.6),
        endY: area.startY + Math.floor(height * 0.7),
      },
      properties: {
        isPassable: false,
        isBuildable: false,
        propertyValueModifier: 1.1,
      },
    });
  }

  // Add fields
  if (Math.random() > 0.3) {
    features.push({
      id: 'field-' + Math.random().toString(36).substr(2, 9),
      type: 'field',
      color: 'rgba(234, 179, 8, 0.3)',
      description: 'Open fields suitable for development',
      boundaries: {
        startX: area.startX + Math.floor(width * 0.1),
        startY: area.startY + Math.floor(height * 0.6),
        endX: area.startX + Math.floor(width * 0.3),
        endY: area.startY + Math.floor(height * 0.8),
      },
      properties: {
        isPassable: false,
        isBuildable: false,
        propertyValueModifier: 1.0,
      },
    });
  }

  return features;
};

const generatePolygonPoints = (
  center: Point,
  radius: number,
  vertices: number,
  irregularity: number = 0.3
): Point[] => {
  const points: Point[] = [];
  const angleStep = (Math.PI * 2) / vertices;

  for (let i = 0; i < vertices; i++) {
    const angle = i * angleStep;
    const currentRadius = radius * (1 + (Math.random() * 2 - 1) * irregularity);
    points.push({
      x: Math.floor(center.x + currentRadius * Math.cos(angle)),
      y: Math.floor(center.y + currentRadius * Math.sin(angle)),
    });
  }

  return points;
};

const calculateBoundingBox = (points: Point[]) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    startX: Math.min(...xs),
    startY: Math.min(...ys),
    endX: Math.max(...xs),
    endY: Math.max(...ys),
  };
};

export const generateDistricts = (gridSize: number): District[] => {
  const districts: District[] = [
    {
      id: 'riverfront-plaza',
      name: 'Riverfront Plaza',
      color: 'rgba(59, 130, 246, 0.2)', // blue
      description:
        'A modern district centered around a scenic river, blending nature with urban development',
      boundaries: generatePolygonPoints(
        { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) },
        gridSize / 4,
        6
      ),
      boundingBox: { startX: 0, startY: 0, endX: 0, endY: 0 }, // Will be calculated
      terrainFeatures: [],
    },
    {
      id: 'forest-hills',
      name: 'Forest Hills',
      color: 'rgba(16, 185, 129, 0.2)', // green
      description:
        'Eco-friendly residential area nestled among lush forests and natural trails',
      boundaries: generatePolygonPoints(
        { x: Math.floor(gridSize / 4), y: Math.floor(gridSize / 4) },
        gridSize / 3,
        5
      ),
      boundingBox: { startX: 0, startY: 0, endX: 0, endY: 0 }, // Will be calculated
      terrainFeatures: [],
    },
    {
      id: 'mountain-valley',
      name: 'Mountain Valley',
      color: 'rgba(245, 158, 11, 0.2)', // amber
      description: 'Industrial district naturally sheltered by mountain ranges',
      boundaries: generatePolygonPoints(
        { x: Math.floor(gridSize * 0.75), y: Math.floor(gridSize * 0.75) },
        gridSize / 3,
        7
      ),
      boundingBox: { startX: 0, startY: 0, endX: 0, endY: 0 }, // Will be calculated
      terrainFeatures: [],
    },
    {
      id: 'harbor-district',
      name: 'Harbor District',
      color: 'rgba(14, 165, 233, 0.2)', // sky blue
      description:
        'Vibrant waterfront area with scenic river views and maritime activities',
      boundaries: generatePolygonPoints(
        { x: Math.floor(gridSize * 0.2), y: Math.floor(gridSize * 0.8) },
        gridSize / 4,
        5
      ),
      boundingBox: { startX: 0, startY: 0, endX: 0, endY: 0 }, // Will be calculated
      terrainFeatures: [],
    },
    {
      id: 'hillside-commons',
      name: 'Hillside Commons',
      color: 'rgba(168, 85, 247, 0.2)', // purple
      description:
        'Modern entertainment district built along natural elevation changes',
      boundaries: generatePolygonPoints(
        { x: Math.floor(gridSize * 0.8), y: Math.floor(gridSize * 0.2) },
        gridSize / 4,
        6
      ),
      boundingBox: { startX: 0, startY: 0, endX: 0, endY: 0 }, // Will be calculated
      terrainFeatures: [],
    },
  ];

  // Calculate bounding boxes and generate terrain features
  return districts.map((district) => {
    const boundingBox = calculateBoundingBox(district.boundaries);
    return {
      ...district,
      boundingBox,
      terrainFeatures: generateTerrainFeatures(boundingBox),
    };
  });
};
