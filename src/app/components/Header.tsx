'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Search as SearchIcon } from 'lucide-react';
import { useAppContext } from '@/store/AppContext';
import { useState } from "react";
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
import { Input } from '@/components/ui/input';
import PopupModal from './Rule_sub';

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="themed-section sticky top-0 z-50 w-full border-b bg-white">
        <div className="px-4 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {logo?.sourceUrl ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || "Logo"}
                width={80}
                height={80}
                className="rounded object-cover bg-white"
              />
            ) : (
              <span className="font-bold text-gray-900">{host}</span>
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
                className="pl-10 bg-transparent"
              />
            </div>
          </div>

          {/* Navigation / Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
              <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <span
                      className={`hamburger${mobileMenuOpen ? ' open' : ''}`}
                      aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                      <span className="hamburger-bar"></span>
                    </span>
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

                  {/* Standout Subscribe Button in mobile */}
                  <DropdownMenuItem asChild>
                    <Button
                      onClick={() => {
                        setIsModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all w-full text-left py-2 mt-2 animate-fadeInDown"
                    >
                      Subscribe
                    </Button>
                  </DropdownMenuItem>

                  {/* Mobile Search */}
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
                        <Button
                          asChild
                          variant="navlink"
                          className={`${isActive ? "text-yellow-400" : ""}`}
                        >
                          <Link href={href}>{title}</Link>
                        </Button>
                      </NavigationMenuItem>
                    );
                  })}

                  {/* More Menu */}
                  <NavigationMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="navlink"
                          className="flex items-center"
                        >
                          Find more
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white shadow-lg border animate-fadeInDown">
                        {links.slice(3).map(({ title, href }) => (
                          <DropdownMenuItem key={href} asChild>
                            <Button asChild variant="navlink" className="w-full text-left py-2">
                              <Link href={href}>{title}</Link>
                            </Button>
                          </DropdownMenuItem>
                        ))}
                        {/* No Subscribe button in desktop dropdown! */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>

                  {/* Subscribe Button (desktop only, NOT in More dropdown) */}
                  <NavigationMenuItem>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all"
                    >
                      Subscribe
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Render */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
