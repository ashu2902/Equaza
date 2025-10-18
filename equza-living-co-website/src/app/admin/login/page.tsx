/**
 * Admin Login Page
 *
 * Firebase Authentication login for admin users
 * Following UI_UX_Development_Guide.md brand guidelines
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';

// Firebase
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';

// Components
import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FadeIn } from '@/components/ui/MotionWrapper';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const router = useRouter();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('🔐 Admin Login Process Started');
    console.log('📧 Email:', email);

    if (!auth) {
      console.error('❌ Firebase auth not configured');
      setError(
        'Firebase authentication not configured. Please check your environment variables.'
      );
      setIsLoading(false);
      return;
    }

    console.log('✅ Firebase auth object available');

    try {
      console.log('🔄 Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('✅ Firebase authentication successful');
      console.log('👤 User details:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        displayName: userCredential.user.displayName,
      });

      // Get user token to check admin status
      console.log('🔍 Fetching ID token with claims...');
      const token = await userCredential.user.getIdTokenResult();
      console.log('📜 Token details:', {
        authTime: token.authTime,
        issuedAtTime: token.issuedAtTime,
        expirationTime: token.expirationTime,
        signInProvider: token.signInProvider,
        signInSecondFactor: token.signInSecondFactor,
        token: token.token.substring(0, 50) + '...', // Show first 50 chars only
      });

      console.log('🎯 Custom claims:', token.claims);
      console.log('👑 Admin claim present:', !!token.claims.admin);
      console.log('🔑 Admin claim value:', token.claims.admin);

      if (!token.claims.admin) {
        console.warn('❌ Admin access denied - no admin claim found');
        console.log('📋 Available claims:', Object.keys(token.claims));
        setError('Access denied. Admin privileges required.');
        if (auth) {
          console.log('🚪 Signing out user...');
          await auth.signOut();
        }
        return;
      }

      console.log('🎉 Admin access granted! Establishing server session...');
      try {
        const idToken = await userCredential.user.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
      } catch (e) {
        console.warn(
          '⚠️ Failed to create session cookie. Proceeding without server session.'
        );
      }

      console.log('🎉 Admin access granted! Redirecting to dashboard...');
      router.push('/admin');
    } catch (err: any) {
      console.error('❌ Login error occurred:', err);
      console.log('🔍 Error details:', {
        code: err.code,
        message: err.message,
        name: err.name,
        stack: err.stack?.substring(0, 200) + '...', // First 200 chars of stack
      });

      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          console.log('🚨 Invalid email format');
          setError('Invalid email address.');
          break;
        case 'auth/user-disabled':
          console.log('🚨 User account disabled');
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          console.log('🚨 User not found in Firebase');
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          console.log('🚨 Incorrect password provided');
          setError('Incorrect password.');
          break;
        case 'auth/invalid-credential':
          console.log('🚨 Invalid credentials (email/password combination)');
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          console.log('🚨 Rate limited due to too many failed attempts');
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          console.log('🚨 Unknown error code:', err.code);
          setError('Login failed. Please try again.');
      }
    } finally {
      console.log('🏁 Login process completed');
      setIsLoading(false);
    }
  };

  // Show loading if still checking auth
  if (authLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <Container size='sm' className='w-full max-w-md'>
        <FadeIn>
          <div className='text-center mb-8'>
            <div className='mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <Shield className='h-6 w-6 text-primary' />
            </div>
            <Typography variant='h2' className='text-gray-900'>
              Admin Access
            </Typography>
            <p className='mt-2 text-sm text-gray-600'>
              Sign in to access the admin dashboard
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='text-center'>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-md p-3'>
                    <p className='text-sm text-red-600'>{error}</p>
                  </div>
                )}

                <div>
                  <Label htmlFor='email'>Email address</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Enter your admin email'
                    className='mt-1'
                  />
                </div>

                <div>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative mt-1'>
                    <Input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Enter your password'
                      className='pr-10'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-gray-400' />
                      ) : (
                        <Eye className='h-4 w-4 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className='h-4 w-4 mr-2' />
                      Sign in
                    </>
                  )}
                </Button>
              </form>

              <div className='mt-6 text-center'>
                <p className='text-xs text-gray-500'>
                  Only authorized admin users can access this area.
                  <br />
                  Contact your system administrator for access.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </Container>
    </div>
  );
}
