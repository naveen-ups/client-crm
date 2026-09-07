'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

export interface SiteInfo {
  id: string;
  name: string;
}

export interface UserSession {
  email?: string;
  role?: string;
  siteId?: string;
  allowedSites?: string[];
}

interface SiteContextValue {
  activeSiteId: string;
  activeSiteName: string;
  availableSites: SiteInfo[];
  setActiveSiteId: (id: string) => void;
  currentUser: UserSession | null;
  isLoading: boolean;
  handleSignOut: () => Promise<void>;
  refreshSites: () => Promise<void>;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
}

const SiteContext = createContext<SiteContextValue | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeSiteId, setActiveSiteId] = useState<string>('aurumm');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [availableSites, setAvailableSites] = useState<SiteInfo[]>([
    { id: 'aurumm', name: 'Aurumm Fine Jewellery' },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load User session
  useEffect(() => {
    async function loadUserSession() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const metaRole =
            (user.app_metadata?.role as string) ||
            (user.user_metadata?.role as string) ||
            'root';
          const metaSiteId =
            (user.app_metadata?.site_id as string) ||
            (user.user_metadata?.site_id as string);
          const metaAllowedSites =
            (user.app_metadata?.allowed_sites as string[]) ||
            (user.user_metadata?.allowed_sites as string[]);

          const sessionUser: UserSession = {
            email: user.email,
            role: metaRole,
            siteId: metaSiteId,
            allowedSites: metaAllowedSites,
          };
          setCurrentUser(sessionUser);

          if (metaSiteId) {
            setActiveSiteId(metaSiteId);
          } else if (
            metaAllowedSites &&
            metaAllowedSites.length > 0 &&
            !metaAllowedSites.includes('*')
          ) {
            setActiveSiteId(metaAllowedSites[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch user session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserSession();
  }, []);

  // Fetch available sites from Supabase `websites` table
  const fetchSites = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data: sitesList } = await supabase
        .from('websites')
        .select('id, name');

      if (sitesList && sitesList.length > 0) {
        const userRestrictedSite =
          currentUser?.siteId ||
          (currentUser?.allowedSites && !currentUser.allowedSites.includes('*')
            ? currentUser.allowedSites[0]
            : null);

        if (currentUser && currentUser.role !== 'root' && userRestrictedSite) {
          const filtered = sitesList.filter((s) => s.id === userRestrictedSite);
          setAvailableSites(
            filtered.length > 0
              ? filtered
              : [{ id: userRestrictedSite, name: userRestrictedSite.toUpperCase() }]
          );
          setActiveSiteId(userRestrictedSite);
        } else {
          setAvailableSites(sitesList);
          // If current activeSiteId not in list, fallback to first
          if (!sitesList.some((s) => s.id === activeSiteId)) {
            setActiveSiteId(sitesList[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load websites list:', err);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [currentUser]);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const activeSite = availableSites.find((s) => s.id === activeSiteId);
  const activeSiteName = activeSite?.name || 'Content Studio';

  return (
    <SiteContext.Provider
      value={{
        activeSiteId,
        activeSiteName,
        availableSites,
        setActiveSiteId,
        currentUser,
        isLoading,
        handleSignOut,
        refreshSites: fetchSites,
        isMobileNavOpen,
        setIsMobileNavOpen,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
