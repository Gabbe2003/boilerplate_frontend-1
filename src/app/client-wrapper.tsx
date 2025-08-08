/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { ReactNode } from 'react';
import { AppProvider } from '@/store/AppContext';

interface RootClientProvidersProps {
  children: ReactNode;
  links: any;
  logo: any;
  posts: any;
}

export default function RootClientProviders({
  children,
  links,
  logo,
  posts,
}: RootClientProvidersProps) {
  return (
    <AppProvider links={links} logo={logo} posts={posts}>
      {children}
    </AppProvider>
  );
}
