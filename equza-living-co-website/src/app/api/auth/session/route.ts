import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase/server-app';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    if (!decoded || !decoded.admin) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });
    const res = NextResponse.json({ success: true });
    res.headers.set('Cache-Control', 'no-store');
    cookies().set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRES_IN / 1000,
    });
    return res;
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    const existing = cookieStore.get(SESSION_COOKIE_NAME);
    if (existing) {
      cookieStore.set(SESSION_COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}



