import { NextResponse } from 'next/server';

import { featuredProjects } from '@/mock/landing';

export async function GET() {
  try {
    return NextResponse.json(featuredProjects);
  } catch (error) {
    console.error('Axios error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
