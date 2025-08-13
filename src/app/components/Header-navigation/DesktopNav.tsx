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

export default function DesktopNav({ onNewsletterClick, categories }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3">
      {/* Categories — end-aligned parent already handled by Header */}
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-2">
          {categories?.length > 0 && (
            <NavigationMenuItem>
              <div className="flex items-center gap-1 flex-wrap max-w-[48vw] lg:max-w-[40vw] overflow-hidden">
                {categories.map((cat) => (
                  <Link href={`/category/${cat.slug}`} key={cat.id}>
                    <Button
                      variant="ghost"
                      className="px-4 py-2 text-base font-normal min-w-0 text-black hover:bg-transparent hover:underline"
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

      {/* Right-side actions */}
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className={`px-4 py-2 text-base font-normal min-w-0 text-black ${
            pathname === '/advertisement' ? 'ring-2 ring-gray-300' : ''
          }`}
        >
          <Link href="/advertisement">Advertisement</Link>
        </Button>

        <Button
          onClick={onNewsletterClick}
          variant="ghost"
          className="px-4 py-2 text-base font-normal min-w-0 text-black"
        >
          Newsletter
        </Button>
      </div>
    </div>
  );
}