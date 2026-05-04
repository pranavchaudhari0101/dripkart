import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/react';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';

/**
 * Bridges Clerk authentication with the Zustand authStore.
 * When a user signs in via Clerk, this hook syncs their profile
 * (including role) from the backend into the local store.
 */
export function useAuthSync() {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { login, logout, user: storedUser } = useAuthStore();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      // Only sync once per sign-in session (unless store is empty)
      if (hasSynced.current && storedUser) return;

      const syncUser = async () => {
        try {
          const res = await api.get('/auth/me');
          const u = res.data.user;
          if (u) {
            login(
              {
                id: u.id,
                name: u.name || clerkUser.fullName || 'User',
                email: u.email || clerkUser.primaryEmailAddress?.emailAddress || '',
                role: u.role || 'CUSTOMER',
              },
              'clerk-managed' // token is managed by Clerk, not stored here
            );
            hasSynced.current = true;
          }
        } catch (err) {
          console.warn('[AuthSync] Failed to sync user from backend:', err);
          // Even if backend sync fails, populate basic info from Clerk
          login(
            {
              id: clerkUser.id,
              name: clerkUser.fullName || 'User',
              email: clerkUser.primaryEmailAddress?.emailAddress || '',
              role: (clerkUser.publicMetadata?.role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER',
            },
            'clerk-managed'
          );
          hasSynced.current = true;
        }
      };

      syncUser();
    } else if (!isSignedIn && isLoaded) {
      // User signed out
      if (storedUser) {
        logout();
      }
      hasSynced.current = false;
    }
  }, [isSignedIn, isLoaded, clerkUser?.id]);
}

/**
 * Component wrapper for the hook — mount this in App.tsx
 */
export function AuthSync() {
  useAuthSync();
  return null;
}
