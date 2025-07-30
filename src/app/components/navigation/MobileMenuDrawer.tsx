'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerClose,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import CategoryDropdowns from './CategoryDropdowns';

interface LinkItem {
  title: string;
  href: string;
}

interface MobileMenuDrawerProps {
  links: LinkItem[];
  onNewsletterClick: () => void;
}

export default function MobileMenuDrawer({ links, onNewsletterClick }: MobileMenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="navlink" className="p-2">
          <MenuIcon className="h-6 w-6 text-black" />
        </Button>
      </DrawerTrigger>
      <DrawerOverlay className="fixed inset-0 bg-black/30 z-40" />

      <DrawerContent
        className="
          fixed top-0 right-0 h-full
          w-full
          bg-white z-[8000] shadow-lg flex flex-col
          data-[vaul-drawer-direction=right]:inset-y-0
          data-[vaul-drawer-direction=right]:right-0
          data-[vaul-drawer-direction=right]:border-l
        "
      >
        <DrawerTitle className="sr-only">Mobile Navigation</DrawerTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <DrawerClose asChild>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
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
                  variant="navlink"
                  className="w-full text-left py-2"
                  onClick={() => setOpen(false)}
                >
                  <Link href={href}>{title}</Link>
                </Button>
              </li>
            ))}
            <li>
              <Button
                onClick={() => {
                  onNewsletterClick();
                  setOpen(false);
                }}
                className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all w-full text-left py-2 mt-2"
              >
                Newsletter
              </Button>
            </li>
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
