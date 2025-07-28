// ViewedPostsDynamic.tsx
'use client';
import dynamic from 'next/dynamic';
const ViewedPosts = dynamic(() => import('./ViewsPosts'), { ssr: false });

export default ViewedPosts;
