'use client';

import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MobileNav({ links, onNewsletterClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="[@media(min-width:1050px)]:hidden flex items-center gap-2">
      <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="navlink">
            {/* Hamburger menu, explicitly black */}
            <MenuIcon className="h-6 w-6 text-black" />
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

          <DropdownMenuItem asChild>
            <Button
              onClick={() => {
                onNewsletterClick();
                setMobileMenuOpen(false);
              }}
              className="bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all w-full text-left py-2 mt-2 animate-fadeInDown"
            >
              Newsletter
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
