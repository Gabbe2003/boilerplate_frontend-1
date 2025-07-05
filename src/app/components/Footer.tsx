'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/store/AppContext';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const pathname = usePathname();
  const { logo, links } = useAppContext();

  return (
    <footer className="w-full themed-section border-t px-4">
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <Link href="/" className="flex-shrink-0">
          {logo?.sourceUrl ? (
            <Image
              src={logo.sourceUrl}
              alt={logo.altText || 'Logo'}
              width={150}
              height={100}
              style={{backgroundColor: 'white'}}
            />
          ) : (
            <span className="font-bold">{host}</span>
          )}
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex flex-wrap justify-center space-x-4">
            {links.map(({ title, href }) => {
              const isActive = pathname === href;
              return (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-yellow-400'
                          : 'hover:text-gray-300'
                      }`}
                    >
                      {title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <Separator className="border border-gray-700 mt-3" />

      <div className="container mx-auto px-4 text-center text-sm text-gray-400 py-2">
        &copy; {new Date().getFullYear()} Company Name. All rights reserved.
      </div>
    </footer>
  );
}

