'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';
import SocialMediaButtons from '../allSocialMediaButtons';
import PopupModal from '../Rule_sub';

export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const pathname = usePathname();
  const { links, tagline } = useAppContext();
  const currentYear = new Date().getFullYear();

  // ✅ mirror header’s API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenNewsletter = useCallback(() => setIsModalOpen(true), []);
  const handleCloseNewsletter = useCallback(() => setIsModalOpen(false), []);

  const extraLinks = [
    { type: 'button', title: 'Newsletter' },
    { type: 'link', title: 'Work with us', href: '/work' },
    { type: 'link', title: 'Sitemap', href: '/sitemap' },
  ];

  const baseBtnClasses =
    'text-base w-full justify-start px-0 break-normal whitespace-normal hyphens-auto text-pretty';

  const renderNavItem = (title: string, href?: string) => {
    const isActive = href && pathname === href;
    const isHash = href?.startsWith('#');

    // 🔗 Special case: Newsletter opens modal (same as header)
    if (title.toLowerCase() === 'newsletter') {
      return (
        <Button
          type="button"
          variant="link"
          className={baseBtnClasses}
          onClick={handleOpenNewsletter}
          aria-label="Open newsletter signup"
        >
          {title}
        </Button>
      );
    }

    if (!href) {
      return (
        <Button variant="link" className={baseBtnClasses}>
          {title}
        </Button>
      );
    }

    if (isHash) {
      return (
        <Button
          type="button"
          variant="link"
          className={`${baseBtnClasses} ${isActive ? 'text-yellow-500' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(href.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {title}
        </Button>
      );
    }

    return (
      <Button
        asChild
        variant="link"
        className={`${baseBtnClasses} ${isActive ? 'text-yellow-500' : ''}`}
      >
        <Link href={href}>{title}</Link>
      </Button>
    );
  };

  return (
    <footer id="footer" className="w-full px-2 border-t border-gray-200 bg-gray-100">
      <div className="w-[100%] px-2 lg:w-[70%] mx-auto py-6">
        {/* Logo and Links */}
        <div className="flex flex-col md:flex-row mb-8 gap-8">
          {/* Logo/Tagline */}
          <div className="flex flex-col items-start min-w-[170px]">
            <Link href="/" className="mb-4 flex-shrink-0 flex items-center py-6" aria-label="Go to homepage">
              <Image
                src="/full_logo_with_slogan.png"
                alt="Logo"
                width={150}
                height={60}
                priority
              />
            </Link>
            {tagline && (
              <p className="mt-2 text-sm pr-5 text-gray-500 break-normal whitespace-normal hyphens-auto text-pretty">
                {tagline}
              </p>
            )}
          </div>

          {/* Links in columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 justify-end md:items-start min-w-0">
            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Readers favorites</h3>
              <ul className="space-y-2">
                {extraLinks.map((item, idx) => (
                  <li key={item.title + idx} className="min-w-0">
                    {renderNavItem(item.title, item.href)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Company</h3>
              <ul className="space-y-2">
                {links.map((link, idx) =>
                  idx >= 3 ? (
                    <li key={link.href} className="min-w-0">
                      {renderNavItem(link.title, link.href)}
                    </li>
                  ) : null
                )}
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">About us</h3>
              <ul className="space-y-2">
                {links.map((link, idx) =>
                  idx < 3 ? (
                    <li key={link.href} className="min-w-0">
                      {renderNavItem(link.title, link.href)}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-t border-gray-300" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-gray-500 md:text-left break-normal whitespace-normal hyphens-auto text-pretty">
            &copy; {currentYear} {host}. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center md:justify-end">
            <SocialMediaButtons className="flex-wrap flex-col sm:flex-row sm:flex-nowrap" />
          </div>
        </div>
      </div>

      {/* 📨 Newsletter Modal (same props as header) */}
      <PopupModal isOpen={isModalOpen} onClose={handleCloseNewsletter} />
    </footer>
  );
}
