'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu as MenuIcon, Search as SearchIcon } from 'lucide-react';
import { useAppContext } from '@/store/AppContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const pathname = usePathname();

  return (
   <header className="themed-section sticky top-0 z-50 w-full border-b ">
    <div className="px-4 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between ">
        {/* Logo */}
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
            <span className=" font-bold">{host}</span>
          )}
        </Link>

        {/* Desktop Search */}
        <div className="hidden sm:block flex-grow max-w-xs mx-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              aria-label="Search"
              value={searchBarHeader}
              onChange={(e) => setSearchBarHeader(e.target.value)}
              className="pl-10  bg-transparent"
            />
          </div>
        </div>

        {/* Navigation / Menu */}
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-screen max-w-none left-0 rounded-none p-4 space-y-4 bg-white"
              >
                {links.map(({ title, href }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Link
                      href={href}
                      className="text-sm font-medium text-black hover:text-gray-700"
                    >
                      {title}
                    </Link>
                  </DropdownMenuItem>
                ))}

                {/* mobile search at bottom */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      aria-label="Search"
                      value={searchBarHeader}
                      onChange={(e) => setSearchBarHeader(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-4">
                {links.slice(0, 3).map(({ title, href }) => {
                  const isActive = pathname === href;
                  return (
                    <NavigationMenuItem key={href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={href}
                          className={`text-sm font-medium ${
                            isActive
                              ? 'text-yellow-400'
                              : ' hover:text-gray-300'
                          }`}
                        >
                          {title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center text-sm font-medium hover:text-gray-300"
                      >
                        More
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {links.slice(3).map(({ title, href }) => (
                        <DropdownMenuItem key={href} asChild>
                          <Link
                            href={href}
                            className="text-sm font-medium text-black hover:text-gray-700"
                          >
                            {title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
