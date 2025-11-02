import { NextRequest, NextResponse } from 'next/server';

import { externalApi } from '@/lib/api/external';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const response = await externalApi.get(`/blog/${slug}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Axios error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
