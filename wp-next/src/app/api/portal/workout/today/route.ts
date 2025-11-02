import { NextResponse } from 'next/server';

import { externalApi } from '@/lib/api/external';
import { workoutExercises } from '@/mock/portal';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured');

  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const res = workoutExercises.filter((exercise) =>
      exercise.workoutDays.includes(today)
    );
    // const response = await externalApi.get('/ai-tools');

    // return NextResponse.json(response || ai_tools);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Axios error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
