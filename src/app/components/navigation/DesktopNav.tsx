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

export default function DesktopNav({ links, onNewsletterClick }: DesktopNavProps) {
  const pathname = usePathname();
  const socialLinks = links.slice(3);
  const [socialOpen, setSocialOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-5 xl:gap-10 min-w-0 flex-shrink">
      <NavigationMenu>
        {/* Category dropdowns */}
        <CategoryDropdowns />

        <NavigationMenuList className="flex items-center gap-5 xl:gap-10">
          {/* Social Dropdown */}
          {socialLinks.length > 0 && (
            <NavigationMenuItem
              onMouseEnter={() => setSocialOpen(true)}
              onMouseLeave={() => setSocialOpen(false)}
            >
              <DropdownMenu open={socialOpen} onOpenChange={setSocialOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="navlink"
                    className="flex items-center px-5 py-2 text-lg xl:px-8 xl:py-3 xl:text-xl font-medium min-w-0"
                  >
                    SOCIAL
                    <ChevronDown className="ml-2 h-5 w-5 xl:h-6 xl:w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white shadow-lg border animate-fadeInDown min-w-[200px] xl:min-w-[260px]"
                >
                  {socialLinks.map(({ title, href }: LinkItem) => (
                    <DropdownMenuItem key={href} asChild>
                      <Button
                        asChild
                        variant="navlink"
                        className="w-full text-left py-2 px-4 text-lg xl:py-3 xl:px-6 xl:text-xl font-medium min-w-0"
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
              className={`
                bg-yellow-400 text-black font-semibold hover:bg-yellow-500 shadow-md transition-all
                px-5 py-2 text-sm xl:px-8 xl:py-3 xl:text-xl min-w-0
                ${pathname === '/advertisement' ? 'ring-2 ring-yellow-500' : ''}
              `}
            >
              <Link href="/advertisement">Advertisement</Link>
            </Button>
          </NavigationMenuItem>

          {/* Newsletter Button */}
          <NavigationMenuItem>
            <Button
              onClick={onNewsletterClick}
              className="bg-sky-500 text-white font-semibold hover:bg-sky-600 shadow-md transition-all px-5 py-2 text-sm xl:px-8 xl:py-3 xl:text-xl min-w-0"
            >
              Newsletter
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
