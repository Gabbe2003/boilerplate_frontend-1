'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import type { Logo, Post } from '@/lib/types';

export interface LinkItem {
  title: string;
  href: string;
}

const host = process.env.NEXT_PUBLIC_HOSTNAME || '';

export const DEFAULT_LINKS = [
  { title: 'Contact', href: '/contact' },
  {
    title: host ? `About ${host}` : 'About',
    href: '/about',
  },
  { title: 'Privacy policy', href: '/privacy' },
  { title: 'Social Media', href: '#footer' },
  { title: 'Archive', href: '/archive' },
];


export interface AppContextType {
  links: LinkItem[];
  logo: Logo | null;
  posts?: Post[];
  searchBarHeader: string;
  setSearchBarHeader: Dispatch<SetStateAction<string>>;
  tagline: string;
}

export const AppContext = createContext<AppContextType>({
  links: DEFAULT_LINKS,
  logo: null,
  posts: [],
  searchBarHeader: '',
  setSearchBarHeader: () => {},
  tagline: '',
});

export interface AppProviderProps {
  children: ReactNode;
  links?: LinkItem[];
  logo?: Logo | null;
  posts?: Post[];
  tagline?: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  links = DEFAULT_LINKS,
  logo = null,
  posts = [],
  tagline = '',
}) => {
  const [searchBarHeader, setSearchBarHeader] = useState('');

  return (
    <AppContext.Provider
      value={{
        links,
        logo,
        searchBarHeader,
        setSearchBarHeader,
        posts,
        tagline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  return context;
}