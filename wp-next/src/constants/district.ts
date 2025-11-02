import { District } from '@/lib/generate-districts';

export const districts: District[] = [
  {
    id: 'riverfront-plaza',
    name: 'Riverfront Plaza',
    color: 'rgba(59, 130, 246, 0.2)',
    description:
      'A modern district centered around a scenic river, blending nature with urban development',
    boundaries: [
      {
        x: 17,
        y: 12,
      },
      {
        x: 15,
        y: 18,
      },
      {
        x: 9,
        y: 16,
      },
      {
        x: 7,
        y: 12,
      },
      {
        x: 9,
        y: 8,
      },
      {
        x: 14,
        y: 7,
      },
    ],
    boundingBox: {
      startX: 7,
      startY: 7,
      endX: 17,
      endY: 18,
    },
    terrainFeatures: [
      {
        id: 'field-10kdca1vq',
        type: 'field',
        color: 'rgba(234, 179, 8, 0.3)',
        description: 'Open fields suitable for development',
        boundaries: {
          startX: 8,
          startY: 13,
          endX: 10,
          endY: 15,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1,
        },
      },
    ],
  },
  {
    id: 'forest-hills',
    name: 'Forest Hills',
    color: 'rgba(16, 185, 129, 0.2)',
    description:
      'Eco-friendly residential area nestled among lush forests and natural trails',
    boundaries: [
      {
        x: 12,
        y: 6,
      },
      {
        x: 8,
        y: 12,
      },
      {
        x: -2,
        y: 11,
      },
      {
        x: -2,
        y: 0,
      },
      {
        x: 8,
        y: -2,
      },
    ],
    boundingBox: {
      startX: -2,
      startY: -2,
      endX: 12,
      endY: 12,
    },
    terrainFeatures: [
      {
        id: 'forest-vdh22zt2r',
        type: 'forest',
        color: 'rgba(34, 197, 94, 0.3)',
        description: 'Dense forest area with natural wildlife',
        boundaries: {
          startX: 3,
          startY: 5,
          endX: 6,
          endY: 7,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1.1,
        },
      },
      {
        id: 'field-v4vlz6lah',
        type: 'field',
        color: 'rgba(234, 179, 8, 0.3)',
        description: 'Open fields suitable for development',
        boundaries: {
          startX: -1,
          startY: 6,
          endX: 2,
          endY: 9,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1,
        },
      },
    ],
  },
  {
    id: 'mountain-valley',
    name: 'Mountain Valley',
    color: 'rgba(245, 158, 11, 0.2)',
    description: 'Industrial district naturally sheltered by mountain ranges',
    boundaries: [
      {
        x: 27,
        y: 18,
      },
      {
        x: 22,
        y: 23,
      },
      {
        x: 16,
        y: 24,
      },
      {
        x: 11,
        y: 21,
      },
      {
        x: 11,
        y: 14,
      },
      {
        x: 16,
        y: 9,
      },
      {
        x: 23,
        y: 11,
      },
    ],
    boundingBox: {
      startX: 11,
      startY: 9,
      endX: 27,
      endY: 24,
    },
    terrainFeatures: [
      {
        id: 'field-z5ro30r6j',
        type: 'field',
        color: 'rgba(234, 179, 8, 0.3)',
        description: 'Open fields suitable for development',
        boundaries: {
          startX: 12,
          startY: 18,
          endX: 15,
          endY: 21,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1,
        },
      },
    ],
  },
  {
    id: 'harbor-district',
    name: 'Harbor District',
    color: 'rgba(14, 165, 233, 0.2)',
    description:
      'Vibrant waterfront area with scenic river views and maritime activities',
    boundaries: [
      {
        x: 9,
        y: 19,
      },
      {
        x: 5,
        y: 23,
      },
      {
        x: -2,
        y: 22,
      },
      {
        x: -2,
        y: 14,
      },
      {
        x: 6,
        y: 12,
      },
    ],
    boundingBox: {
      startX: -2,
      startY: 12,
      endX: 9,
      endY: 23,
    },
    terrainFeatures: [
      {
        id: 'forest-q0uf3m8wv',
        type: 'forest',
        color: 'rgba(34, 197, 94, 0.3)',
        description: 'Dense forest area with natural wildlife',
        boundaries: {
          startX: 1,
          startY: 19,
          endX: 3,
          endY: 22,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1.1,
        },
      },
      {
        id: 'field-wwnwhu9cm',
        type: 'field',
        color: 'rgba(234, 179, 8, 0.3)',
        description: 'Open fields suitable for development',
        boundaries: {
          startX: -1,
          startY: 18,
          endX: 1,
          endY: 20,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1,
        },
      },
    ],
  },
  {
    id: 'hillside-commons',
    name: 'Hillside Commons',
    color: 'rgba(168, 85, 247, 0.2)',
    description:
      'Modern entertainment district built along natural elevation changes',
    boundaries: [
      {
        x: 25,
        y: 4,
      },
      {
        x: 22,
        y: 10,
      },
      {
        x: 15,
        y: 9,
      },
      {
        x: 13,
        y: 4,
      },
      {
        x: 15,
        y: -3,
      },
      {
        x: 22,
        y: -3,
      },
    ],
    boundingBox: {
      startX: 13,
      startY: -3,
      endX: 25,
      endY: 10,
    },
    terrainFeatures: [
      {
        id: 'mountain-fm4hpy89m',
        type: 'mountain',
        color: 'rgba(120, 113, 108, 0.3)',
        description: 'Majestic mountains with scenic views',
        boundaries: {
          startX: 20,
          startY: -1,
          endX: 22,
          endY: 2,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1.3,
        },
      },
      {
        id: 'forest-3mb3gys00',
        type: 'forest',
        color: 'rgba(34, 197, 94, 0.3)',
        description: 'Dense forest area with natural wildlife',
        boundaries: {
          startX: 17,
          startY: 3,
          endX: 20,
          endY: 6,
        },
        properties: {
          isPassable: false,
          isBuildable: false,
          propertyValueModifier: 1.1,
        },
      },
    ],
  },
];
