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

export const DEFAULT_LINKS: LinkItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Blog', href: '/blog' },
  { title: 'Contact', href: '/contact' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Terms', href: '/terms' },
];
export interface AppContextType {
  links: LinkItem[];
  logo: Logo | null;
  posts: Post[];
  searchBarHeader: string;
  setSearchBarHeader: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({
  links: DEFAULT_LINKS,
  logo: null,
  posts: [],
  searchBarHeader: '',
  setSearchBarHeader: () => {},
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
  posts
}) => {
  const [searchBarHeader, setSearchBarHeader] = useState('');
  return (
    <AppContext.Provider
      value={{
        links,
        logo,
        searchBarHeader,
        setSearchBarHeader,
        posts
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
