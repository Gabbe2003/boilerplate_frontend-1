'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerClose,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import CategoryDropdowns from './CategoryDropdowns';

interface LinkItem {
  title: string;
  href: string;
}

interface MobileNavProps {
  links: LinkItem[];
  onNewsletterClick: () => void;
}

export default function MobileNav({ links, onNewsletterClick }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-[1099px]:flex hidden items-center gap-2">
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="p-2">
            <MenuIcon className="h-6 w-6 text-black" />
          </Button>
        </DrawerTrigger>
        <DrawerOverlay className="fixed inset-0 bg-black/30 z-40" />

        <DrawerContent
          className="
            fixed top-0 right-0 h-screen w-full
            sm:w-[90vw] md:w-[70vw] lg:w-[50vw]
            bg-white z-50 shadow-lg flex flex-col
            data-[vaul-drawer-direction=right]:inset-y-0
            data-[vaul-drawer-direction=right]:right-0
            data-[vaul-drawer-direction=right]:border-l
          "
        >
          <DrawerTitle className="sr-only">Mobile Navigation</DrawerTitle>

          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-normal text-black">Meny</h2>
            <DrawerClose asChild>
              <Button variant="ghost" onClick={() => setOpen(false)} className="text-black font-normal">
                Stäng
              </Button>
            </DrawerClose>
          </div>

          {/* Categories */}
          <div className="p-4 border-b">
            <CategoryDropdowns isMobile />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map(({ title, href }: LinkItem) => (
                <li key={href}>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-left py-2 text-black font-normal"
                    onClick={() => setOpen(false)}
                  >
                    <Link href={href}>{title}</Link>
                  </Button>
                </li>
              ))}

              {/* Advertisement Button */}
              <li>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-left py-2 mt-2 text-black font-normal"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/advertisement">Advertisement</Link>
                </Button>
              </li>

              {/* Newsletter Button */}
              <li>
                <Button
                  onClick={() => {
                    onNewsletterClick();
                    setOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-left py-2 mt-2 text-black font-normal"
                >
                  Newsletter
                </Button>
              </li>
            </ul>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
