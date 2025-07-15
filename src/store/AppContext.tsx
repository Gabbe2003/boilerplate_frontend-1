'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
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
 {
    title: host ? `About ${host}` : 'About',
    href: '/about', 
  },
  { title: 'Contact', href: '/contact' },
  { title: 'Privacy policy', href: '/privacy' },
  { title: 'Advertisement', href: '/advertisement' },
  { title: 'Social Media', href: '#footer' }, 
  { title: 'Archive', href: '/archive' },
];

export interface AppContextType {
  links: LinkItem[];
  logo: Logo | null;
  posts: Post[];
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
  posts: Post[];
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  links = DEFAULT_LINKS,
  logo = null,
  posts,
}) => {
  const [searchBarHeader, setSearchBarHeader] = useState('');
  const [tagline, setTagline] = useState('');

useEffect(() => {
  const graphqlEndpoint = `${process.env.NEXT_PUBLIC_SHARENAME}/graphql`;

  fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{ generalSettings { description } }`
    }),
  })
    .then(res => res.json())
    .then(data => setTagline(data?.data?.generalSettings?.description || ''))
    .catch(() => setTagline(''));
}, []);



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
