'use client';

import { useEffect, useState } from 'react';

import { User, onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/config';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  adminRole: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAdmin: false,
    adminRole: null,
  });

  useEffect(() => {
    console.log('🔄 useAuth: Setting up authentication listener');

    if (!auth) {
      console.log('⚠️ useAuth: Firebase auth not configured');
      // Firebase not configured, set loading to false and remain as guest
      setAuthState({
        user: null,
        isLoading: false,
        isAdmin: false,
        adminRole: null,
      });
      return;
    }

    console.log('✅ useAuth: Firebase auth configured, setting up listener');

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      console.log('🔔 useAuth: Auth state changed');
      console.log(
        '👤 useAuth: User:',
        user
          ? {
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.displayName,
            }
          : 'null'
      );

      if (user) {
        try {
          console.log(
            '🔍 useAuth: Checking admin status via JWT custom claims'
          );

          // Check admin status using JWT custom claims (same as login flow)
          console.log(
            '🔍 useAuth: Fetching ID token with claims for UID:',
            user.uid
          );
          const tokenResult = await user.getIdTokenResult();

          console.log('🎯 useAuth: Custom claims:', tokenResult.claims);
          console.log(
            '👑 useAuth: Admin claim present:',
            !!tokenResult.claims.admin
          );
          console.log(
            '🔑 useAuth: Admin claim value:',
            tokenResult.claims.admin
          );

          const isAdmin = tokenResult.claims.admin === true;
          const adminRole =
            typeof tokenResult.claims.adminRole === 'string'
              ? tokenResult.claims.adminRole
              : null;

          if (isAdmin) {
            console.log('✅ useAuth: User has admin privileges via JWT claims');
          } else {
            console.log(
              '❌ useAuth: User does not have admin privileges in JWT claims'
            );
          }

          setAuthState({
            user,
            isLoading: false,
            isAdmin,
            adminRole,
          });
        } catch (error) {
          console.error('❌ useAuth: Error checking JWT claims:', error);
          // On error, treat as regular user but still authenticated
          setAuthState({
            user,
            isLoading: false,
            isAdmin: false,
            adminRole: null,
          });
        }
      } else {
        console.log('🚪 useAuth: No user signed in');
        setAuthState({
          user: null,
          isLoading: false,
          isAdmin: false,
          adminRole: null,
        });
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return authState;
}
