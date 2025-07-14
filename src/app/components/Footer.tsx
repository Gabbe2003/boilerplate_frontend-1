'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const pathname = usePathname();
  const { logo, links } = useAppContext();
  const currentYear = new Date().getFullYear();

  // Demo: render links in three columns
  const repeatedLinks = [1, 2, 3].map(i => links);

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-100">
      {/* No max-w-*, use grid to center content */}
      <div className="w-full px-0 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 px-4">
          {/* Logo and About */}
          <div className="flex flex-col items-start justify-start md:col-span-1 col-span-1">
            <Link href="/" className="mb-4 flex-shrink-0 flex items-center ml-0">
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={170}
                  height={60}
                  className="bg-white rounded"
                  priority
                />
              ) : (
                <span className="font-bold text-gray-900 text-xl">{host}</span>
              )}
            </Link>
            <p className="text-gray-600 text-sm text-left">
              {host} – Det senaste inom ekonomi, finans och aktier
            </p>
          </div>

          {/* Render links in columns */}
          {repeatedLinks.map((lks, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                {`Länkar ${idx + 1}`}
              </h3>
              <ul className="space-y-2">
                {lks.map(({ title, href }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Button
                        asChild
                        variant="navlink"
                        className={`text-base w-full justify-start px-0 ${isActive ? 'text-yellow-400' : ''}`}
                      >
                        <Link href={href}>{title}</Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and policies row */}
        <div className="mt-12 flex flex-col gap-4 pt-8 px-4 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-gray-400 md:text-left">
            &copy; {currentYear} {host}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
