'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';
import SocialMediaButtons from './allSocialMediaButtons';
import { useState } from 'react';
import PopupModal from './Rule_sub';

export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const pathname = usePathname();
  const { logo, links, tagline } = useAppContext();
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Slicing logic for columns
  const firstColumnLinks = links.slice(0, 3); // or 4, as you wish!
  const secondColumnLinks = links.slice(3);

  // Information column: link or button (subscribe)
  const extraLinks = [
    {
      type: 'button',
      title: 'Newsletter',
      onClick: () => setIsModalOpen(true),
    },
    { type: 'link', title: 'Work with us', href: '/work' },
    { type: 'link', title: 'Sitemap', href: '/sitemap' },
  ];
  console.log('logo:', logo);

  return (
    <footer id="footer" className="w-full border-t border-gray-200 bg-gray-100">
      <div className="w-[90%] mx-auto py-6 md:py-6">
        {/* Logo and Links: Row on md+, column on mobile */}
        <div className="flex flex-col md:flex-row md:items-start mb-8 gap-8">
          {/* Logo/Tagline */}
          <div className="flex flex-col items-start mb-4 md:mb-0 md:mr-8 min-w-[170px]">
            <Link
              href="/"
              className="mb-4 flex-shrink-0 flex items-center ml-0 py-6"
            >
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={150}
                  height={60}
                  className="bg-white rounded"
                />
              ) : (
                <span className="font-bold text-gray-900 text-xl">{host}</span>
              )}
            </Link>
            {tagline && <p className="mt-2 text-sm text-gray-500">{tagline}</p>}
          </div>
          {/* Links (3 columns on desktop, stacked on mobile) */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* First column: first 3 context links */}
            <div className="flex flex-col items-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                About us
              </h3>
              <ul className="space-y-2">
                {firstColumnLinks.map(({ title, href }) => {
                  const isActive = pathname === href;
                  const isHash = href.startsWith('#');
                  return (
                    <li key={href}>
                      {isHash ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(
                              href.replace('#', ''),
                            );
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {title}
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="navlink"
                          className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
                        >
                          <Link href={href}>{title}</Link>
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Second column: remaining context links */}
            <div className="flex flex-col items-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Company
              </h3>
              <ul className="space-y-2">
                {secondColumnLinks.length === 0 ? (
                  <li className="text-sm text-gray-500">-</li>
                ) : (
                  secondColumnLinks.map(({ title, href }) => {
                    const isActive = pathname === href;
                    const isHash = href.startsWith('#');
                    return (
                      <li key={href}>
                        {isHash ? (
                          <Button
                            type="button"
                            variant="navlink"
                            className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(
                                href.replace('#', ''),
                              );
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            {title}
                          </Button>
                        ) : (
                          <Button
                            asChild
                            variant="navlink"
                            className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
                          >
                            <Link href={href}>{title}</Link>
                          </Button>
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

            {/* Third column: hardcoded extra links and subscribe button */}
            <div className="flex flex-col items-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Readers favorites
              </h3>
              <ul className="space-y-2">
                {extraLinks.map((item, idx) => (
                  <li key={item.title + idx}>
                    {item.type === 'button' ? (
                      <Button
                        variant="navlink"
                        className="text-base w-full justify-start px-0"
                        onClick={item.onClick}
                      >
                        {item.title}
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="navlink"
                        className="text-base w-full justify-start px-0"
                      >
                        <Link href={item.href || '#'}>{item.title}</Link>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
              <PopupModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-t border-gray-300" />

        {/* Copyright and social media row */}
        <div className="mt-0 flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-gray-500 md:text-left">
            &copy; {currentYear} {host}. All rights reserved.
          </p>
          {/* Social icons: vertical on mobile, horizontal on sm+ */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center md:justify-end">
            <SocialMediaButtons className="flex-wrap flex-col sm:flex-row sm:flex-nowrap" />
          </div>
        </div>
      </div>
    </footer>
  );
}
