'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function DesktopNav({ links, onNewsletterClick }) {
  const pathname = usePathname();

  return (
    <div className="hidden [@media(min-width:1050px)]:flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">
          {/* Dropdown menu comes first */}
          <NavigationMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="navlink" className="flex items-center">
                  Find more
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white shadow-lg border animate-fadeInDown"
              >
                {links.map(({ title, href }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Button
                      asChild
                      variant="navlink"
                      className="w-full text-left py-2"
                    >
                      <Link href={href}>{title}</Link>
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem>

          {/* Advertisement Button (gold) */}
          <NavigationMenuItem>
            <Button
              asChild
              className={`bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all ${pathname === '/advertisement' ? 'ring-2 ring-yellow-500' : ''}`}
            >
              <Link href="/advertisement">Advertisement</Link>
            </Button>
          </NavigationMenuItem>

          {/* Newsletter Button (blue, next to Advertisement) */}
          <NavigationMenuItem>
            <Button
              onClick={onNewsletterClick}
              className="bg-sky-500 text-white font-semibold hover:bg-sky-600 shadow-md transition-all"
            >
              Newsletter
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
