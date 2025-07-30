'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getPosts } from '@/lib/graph_queries/getPosts';
import { Post } from '@/lib/types';

// ---------------------
// Type Definitions
// ---------------------
interface SingleCategoryDropdownProps {
  title: string;
  hoverable?: boolean;
  isMobile?: boolean;
}

interface CategoryDropdownsProps {
  isMobile?: boolean;
}

// ---------------------
// Utility
// ---------------------
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------
// Constants
//// ...imports and types remain unchanged

const desktopButtonClasses = `
  flex items-center px-3 py-1 text-sm font-normal min-w-0 text-black
`;

function SingleCategoryDropdown({
  title,
  hoverable = true,
  isMobile = false,
}: SingleCategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (open && posts.length === 0) {
      setLoading(true);
      getPosts().then((allPosts: Post[]) => {
        if (!ignore) {
          setPosts(allPosts.slice(0, 4));
          setLoading(false);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [open]);

  const btnClasses = isMobile
    ? 'w-full text-left py-2 font-normal text-black'
    : desktopButtonClasses;

  const menuContentClass = isMobile
    ? 'bg-white shadow-lg border animate-fadeInDown w-full min-w-0 left-0'
    : 'bg-white shadow-lg border animate-fadeInDown min-w-[240px]';

  return (
    <div
      onMouseEnter={() => {
        if (hoverable && window.innerWidth >= 1230) setOpen(true);
      }}
      onMouseLeave={() => {
        if (hoverable && window.innerWidth >= 1230) setOpen(false);
      }}
      tabIndex={-1}
      style={{ outline: 'none' }}
      className={isMobile ? 'w-full' : ''}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={btnClasses}>
            {title}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isMobile ? 'center' : 'end'}
          className={menuContentClass}
        >
          {loading ? (
            <DropdownMenuItem disabled className="w-full py-2 text-center text-gray-400">
              Laddar in...
            </DropdownMenuItem>
          ) : posts.length === 0 ? (
            <DropdownMenuItem disabled className="w-full py-2 text-center text-gray-400">
              Inga inlägg
            </DropdownMenuItem>
          ) : (
            posts.map((post) => (
              <DropdownMenuItem key={post.slug} asChild>
                <a
                  href={`/${post.slug}`}
                  className="flex w-full px-2 py-2 hover:bg-gray-100 rounded transition gap-3 items-center"
                >
                  {post.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      width={48}
                      height={48}
                      className="rounded-md object-cover flex-shrink-0 border"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-12 h-12 bg-gray-200 text-gray-400 rounded-md border text-xs">
                      No image
                    </span>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-normal text-black truncate">{post.title}</span>
                    {post.date && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" /> {formatDate(post.date)}
                      </span>
                    )}
                  </div>
                </a>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function CategoryDropdowns({ isMobile = false }: CategoryDropdownsProps) {
  return (
    <div className={isMobile ? 'flex flex-col gap-2 items-center w-full' : 'flex items-center gap-4'}>
      <SingleCategoryDropdown title="NYHETER" hoverable={!isMobile} isMobile={isMobile} />
      <SingleCategoryDropdown title="FÖRETAG" hoverable={!isMobile} isMobile={isMobile} />
      <SingleCategoryDropdown title="PRIVAT" hoverable={!isMobile} isMobile={isMobile} />
    </div>
  );
}
