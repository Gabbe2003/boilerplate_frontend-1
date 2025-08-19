'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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
import { renderNewsletter } from '../client/newsletter/renderNewsletter';

interface LinkItem { title: string; href: string }
type Category = { id: string; name: string; slug: string };

interface MobileNavProps {
  links: LinkItem[];
  categories: Category[];
}

export default function MobileNav({ links, categories }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const linkItems = useMemo(
    () =>
      links.map(({ title, href }) => (
        <li key={href}>
          <Button
            asChild
            variant="ghost"
            className="h-auto min-h-0 w-full text-left py-2 text-black font-normal"
            onClick={() => setOpen(false)}
          >
            <Link href={href} prefetch={false}>{title}</Link>
          </Button>
        </li>
      )),
    [links]
  );

  const categoryItems = useMemo(
    () =>
      categories.map((cat) => (
        <Button
          asChild
          key={cat.id}
          variant="ghost"
          className="h-auto min-h-0 w-full text-left py-2 px-2 text-black font-normal hover:bg-transparent hover:underline rounded-none"
          onClick={() => setOpen(false)}
        >
          <Link href={`/category/${cat.slug}`} prefetch={false}>{cat.name}</Link>
        </Button>
      )),
    [categories]
  );

  const btnGhost = 'h-auto min-h-0 w-full text-left py-2 mt-1 text-black font-normal';

  return (
    <div className="flex items-center pl-2">
      <Drawer direction="right" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="p-2">
            <MenuIcon className="h-6 w-6 text-black" />
          </Button>
        </DrawerTrigger>

        <DrawerOverlay className="fixed inset-0 bg-black/30 z-40" />

        <DrawerContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="
            fixed top-0 right-0 h-screen w-full
            sm:w-[90vw] md:w-[70vw] lg:w-[50vw]
            bg-white z-50 shadow-lg flex flex-col
            data-[vaul-drawer-direction=right]:inset-y-0
            data-[vaul-drawer-direction=right]:right-0
            data-[vaul-drawer-direction=right]:border-l
            transition-transform duration-150 ease-out
          "
          style={{ willChange: 'transform' }}
        >
          <DrawerTitle className="sr-only">Mobile Navigation</DrawerTitle>

          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-black text-lg font-normal"
              >
                X
              </Button>
            </DrawerClose>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-3" style={{ contain: 'content' }}>
            <ul className="space-y-1">
              {open && (
                <>
                  {linkItems}

                  {/* Categories */}
                  {categories.length > 0 && (
                    <li>
                      <div className="border-b my-0.5" />
                      <div className="flex flex-col gap-0.5">{categoryItems}</div>
                    </li>
                  )}

                  {/* Advertisement */}
                  <li>
                    <Button
                      asChild
                      variant="ghost"
                      className={btnGhost}
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/advertisement" prefetch={false}>
                        Advertisement
                      </Link>
                    </Button>
                  </li>

                  {/* Newsletter via island (close drawer on click) */}
                  <li onClick={() => setOpen(false)}>
                    {renderNewsletter(btnGhost, 'Newsletter')}
                  </li>
                </>
              )}
            </ul>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
