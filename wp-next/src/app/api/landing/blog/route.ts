import { NextResponse } from 'next/server';

import { externalApi } from '@/lib/api/external';
import { recentPosts } from '@/mock/landing';

export async function GET() {
  try {
    const response = await externalApi.get('/blog');

    return NextResponse.json(response || recentPosts);
  } catch (error) {
    console.error('Axios error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
