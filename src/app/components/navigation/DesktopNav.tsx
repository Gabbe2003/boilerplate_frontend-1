'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CategoryDropdowns from './CategoryDropdowns';

// Define prop types
interface LinkItem {
  title: string;
  href: string;
}

interface DesktopNavProps {
  links: LinkItem[];
  onNewsletterClick: () => void;
}

export default function DesktopNav({
  links,
  onNewsletterClick,
}: DesktopNavProps) {
  const pathname = usePathname();
  const socialLinks = links.slice(3);
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-3 min-w-0 flex-shrink">
      <NavigationMenu>
        <CategoryDropdowns />

        <NavigationMenuList className="flex items-center gap-3">
          {/* Social Dropdown */}
          {socialLinks.length > 0 && (
            <NavigationMenuItem
              onMouseEnter={() => setSocialOpen(true)}
              onMouseLeave={() => setSocialOpen(false)}
            >
              <DropdownMenu open={socialOpen} onOpenChange={setSocialOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-3 py-1 text-sm font-normal min-w-0 text-black"
                  >
                    SOCIAL
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border animate-fadeInDown min-w-[160px]"
                >
                  {socialLinks.map(({ title, href }: LinkItem) => (
                    <DropdownMenuItem key={href} asChild>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full text-left py-1 px-3 text-sm font-normal min-w-0 text-black"
                      >
                        <Link href={href}>{title}</Link>
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          )}

          {/* Advertisement Button */}
          <NavigationMenuItem>
            <Button
              asChild
              variant="ghost"
              className={`
            px-3 py-1 text-sm font-normal min-w-0 text-black
            ${pathname === '/advertisement' ? 'ring-2 ring-gray-300' : ''}
          `}
            >
              <Link href="/advertisement">Advertisement</Link>
            </Button>
          </NavigationMenuItem>

          {/* Newsletter Button */}
          <NavigationMenuItem>
            <Button
              onClick={onNewsletterClick}
              variant="ghost"
              className="px-3 py-1 text-sm font-normal min-w-0 text-black"
            >
              Newsletter
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
