'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useState } from 'react';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import PopupModal from './Rule_sub';
import SearchDrawer from './navigation/Searchbar';

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarHeader(e.target.value);
  };

  return (
    <>
      <header className="themed-section sticky top-0 z-50 w-full border-b bg-white">
        <div className="w-[70%] mx-auto flex items-center justify-between py-1">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex-shrink-0">
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={48}
                  height={48}
                  className="rounded object-cover bg-white"
                />
              ) : (
                <span className="font-bold text-gray-900 text-base">
                  {host}
                </span>
              )}
            </Link>
          </div>

          {/* Navigation and Controls */}
          <div className="flex items-center gap-2">
            {/* MOBILE */}
            <div className="[@media(min-width:1050px)]:hidden flex items-center gap-1">
              <SearchDrawer
                value={searchBarHeader}
                onChange={handleSearchChange}
              />
              <MobileNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
              />
            </div>

            {/* DESKTOP */}
            <div className="hidden [@media(min-width:1050px)]:flex items-center gap-2">
              <DesktopNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
              />
              <div className="ml-2">
                <SearchDrawer
                  value={searchBarHeader}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Newsletter Modal */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
