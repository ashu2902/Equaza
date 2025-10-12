import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase/server-app';

const SESSION_COOKIE_NAME = '__session';
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

export async function POST(request: Request) {
  try {
    console.log('🍪 Creating session cookie...');
    const { idToken } = await request.json();
    if (!idToken) {
      console.log('❌ Missing idToken');
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    console.log('🔐 Token decoded:', { admin: !!decoded?.admin, uid: decoded?.uid });
    if (!decoded || !decoded.admin) {
      console.log('❌ Not an admin user');
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 });
    }

    console.log('🍪 Creating session cookie for admin user:', decoded.uid);
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });
    const res = NextResponse.json({ success: true });
    res.headers.set('Cache-Control', 'no-store');
    const cookieStore = await cookies();
    const isDev = process.env.NODE_ENV !== 'production';
    console.log('🍪 Setting cookie with secure:', !isDev);
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: !isDev, // Allow insecure cookies in development
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRES_IN / 1000,
    });
    console.log('✅ Session cookie created successfully');
    return res;
  } catch (error) {
    console.error('❌ Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const existing = cookieStore.get(SESSION_COOKIE_NAME);
    if (existing) {
      const isDev = process.env.NODE_ENV !== 'production';
      cookieStore.set(SESSION_COOKIE_NAME, '', { httpOnly: true, secure: !isDev, sameSite: 'lax', path: '/', maxAge: 0 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}



