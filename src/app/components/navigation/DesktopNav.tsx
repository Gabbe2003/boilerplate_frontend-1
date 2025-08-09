/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

type Category = { id: string | number; name: string; slug: string };

interface DesktopNavProps {
  links?: { title: string; href: string }[];
  onNewsletterClick: () => void;
  categories: Category[];
}

export default function DesktopNav({
  onNewsletterClick,
  categories,
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    // Show from md and up
    <div className="hidden md:grid w-full grid-cols-[1fr_auto_1fr] items-center">
      {/* Left spacer */}
      <div aria-hidden />

      {/* Centered categories */}
      <div className="min-w-0">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {categories?.length > 0 && (
              <NavigationMenuItem>
                <div className="flex flex-wrap justify-center gap-1">
                  {categories.map((cat) => (
                    <Link href={`/category/${cat.slug}`} key={cat.id}>
                      <Button
                        variant="ghost"
                        className="px-3 py-1 text-sm font-normal min-w-0 text-black hover:bg-transparent hover:underline rounded-none"
                      >
                        {cat.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right-side actions */}
      <div className="justify-self-end flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className={`px-3 py-1 text-sm font-normal min-w-0 text-black ${
            pathname === '/advertisement' ? 'ring-2 ring-gray-300' : ''
          }`}
        >
          <Link href="/advertisement">Advertisement</Link>
        </Button>

        <Button
          onClick={onNewsletterClick}
          variant="ghost"
          className="px-3 py-1 text-sm font-normal min-w-0 text-black"
        >
          Newsletter
        </Button>
      </div>
    </div>
  );
}
