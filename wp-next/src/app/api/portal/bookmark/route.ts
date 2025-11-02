import { NextResponse } from 'next/server';

import { externalApi } from '@/lib/api/external';
import { recentActivities } from '@/mock/portal';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');

  try {
    // const response = await externalApi.get('/ai-tools');

    // return NextResponse.json(response || ai_tools);
    return NextResponse.json(recentActivities);
  } catch (error) {
    console.error('Axios error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
