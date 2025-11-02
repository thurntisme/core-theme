import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (username.trim() === 'admin' && password.trim() === 'pass123') {
    const token = 'dummy-token';

    const res = NextResponse.json({ success: true });
    res.headers.set(
      'Set-Cookie',
      serialize('portal-token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      })
    );
    return res;
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' });
}
