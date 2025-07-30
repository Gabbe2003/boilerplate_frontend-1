'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useState } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import PopupModal from './Rule_sub';
import SearchDrawer from './Searchbar';

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            {/* MOBILE: Search always visible + Mobile Nav */}
            <div className="[@media(min-width:1050px)]:hidden flex items-center gap-2">
              <SearchDrawer
                value={searchBarHeader}
                onChange={(e) => setSearchBarHeader(e.target.value)}
              />
              <MobileNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
              />
            </div>

            {/* DESKTOP: Navigation (DesktopNav includes Newsletter button) */}
            <DesktopNav
              links={links}
              onNewsletterClick={() => setIsModalOpen(true)}
              searchBarHeader={searchBarHeader}
              setSearchBarHeader={setSearchBarHeader}
            />
            {/* Search is already included in DesktopNav */}
          </div>
        </div>
      </header>
      {/* Modal Render */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
