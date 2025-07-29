'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, MenuIcon } from 'lucide-react';
import { useAppContext } from '@/store/AppContext';
import { useState } from 'react';
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
import PopupModal from './Rule_sub';
import SearchDrawer from './Searchbar';

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  <>
    <header className="themed-section sticky top-0 z-50 w-full border-b bg-white">
      <div className="w-[90%] mx-auto flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex flex-col items-start">
          <Link href="/" className="flex-shrink-0">
            {logo?.sourceUrl ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || 'Logo'}
                width={80}
                height={80}
                className="rounded object-cover bg-white"
              />
            ) : (
              <span className="font-bold text-gray-900">{host}</span>
            )}
          </Link>
        </div>

        {/* Navigation and Controls */}
        <div className="flex items-center gap-4">
          {/* MOBILE: Search + Hamburger */}
          <div className="[@media(min-width:1050px)]:hidden flex items-center gap-2">
            {/* Search always visible */}
            <SearchDrawer
              value={searchBarHeader}
              onChange={(e) => setSearchBarHeader(e.target.value)}
            />
            {/* Hamburger */}
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="navlink">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-screen max-w-none left-0 rounded-none p-4 bg-white shadow-lg border animate-fadeInDown"
              >
                {links.map(({ title, href }) => (
                  <DropdownMenuItem key={href} asChild>
                    <Button asChild variant="navlink" className="w-full text-left py-2">
                      <Link href={href}>{title}</Link>
                    </Button>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuItem asChild>
                  <Button
                    onClick={() => {
                      setIsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all w-full text-left py-2 mt-2 animate-fadeInDown"
                  >
                    Newsletter
                  </Button>
                </DropdownMenuItem>
                {/* No search field here! */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* DESKTOP: Navigation */}
          <div className="hidden [@media(min-width:1050px)]:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-4">
                {links.slice(0, 4).map(({ title, href }) => {
                  const isActive = pathname === href;
                  return (
                    <NavigationMenuItem key={href}>
                      <Button
                        asChild
                        variant="navlink"
                        className={`${isActive ? 'text-yellow-400' : ''}`}
                      >
                        <Link href={href}>{title}</Link>
                      </Button>
                    </NavigationMenuItem>
                  );
                })}

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
                      {links.slice(3).map(({ title, href }) => (
                        <DropdownMenuItem key={href} asChild>
                          <Button asChild variant="navlink" className="w-full text-left py-2">
                            <Link href={href}>{title}</Link>
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Newsletter + Search (desktop) */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all"
              >
                Newsletter
              </Button>
              <SearchDrawer
                value={searchBarHeader}
                onChange={(e) => setSearchBarHeader(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
    {/* Modal Render */}
    <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </>
);
};