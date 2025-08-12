'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';
import SocialMediaButtons from '../allSocialMediaButtons';

export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const pathname = usePathname();
  const { logo, links, tagline } = useAppContext();
  const currentYear = new Date().getFullYear();

  const extraLinks = [
    { type: 'button', title: 'Newsletter' },
    { type: 'link', title: 'Work with us', href: '/work' },
    { type: 'link', title: 'Sitemap', href: '/sitemap' },
  ];

  const renderNavItem = (title: string, href?: string) => {
    const isActive = href && pathname === href;
    const isHash = href?.startsWith('#');

    if (!href) {
      return (
        <Button variant="navlink" className="text-base w-full justify-start px-0">
          {title}
        </Button>
      );
    }

    if (isHash) {
      return (
        <Button
          type="button"
          variant="navlink"
          className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
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
        variant="navlink"
        className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-500' : ''}`}
      >
        <Link href={href}>{title}</Link>
      </Button>
    );
  };

  return (
    <footer id="footer" className="w-full border-t border-gray-200 bg-gray-100">
      <div className="w-[100%] px-2 lg:w-[70%] mx-auto py-6">
        {/* Logo and Links */}
        <div className="flex flex-col md:flex-row mb-8 gap-8">
          {/* Logo/Tagline */}
          <div className="flex flex-col items-start min-w-[170px]">
            <Link href="/" className="mb-4 flex-shrink-0 flex items-center py-6">
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

          {/* Links in columns */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 justify-end md:items-start">
          <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Readers favorites</h3>
              <ul className="space-y-2">
                {extraLinks.map((item, idx) => (
                  <li key={item.title + idx}>
                    {renderNavItem(item.title, item.href)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Company</h3>
              <ul className="space-y-2">
                {links.map((link, idx) =>
                  idx >= 3 ? (
                    <li key={link.href}>{renderNavItem(link.title, link.href)}</li>
                  ) : null
                )}
              </ul>
            </div>
              <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-700">About us</h3>
              <ul className="space-y-2">
                {links.map((link, idx) =>
                  idx < 3 ? (
                    <li key={link.href}>{renderNavItem(link.title, link.href)}</li>
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
          <p className="text-center text-xs text-gray-500 md:text-left">
            &copy; {currentYear} {host}. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center md:justify-end">
            <SocialMediaButtons className="flex-wrap flex-col sm:flex-row sm:flex-nowrap" />
          </div>
        </div>
      </div>
    </footer>
  );
}
