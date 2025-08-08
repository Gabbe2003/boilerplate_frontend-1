import Link from 'next/link';
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

// Import the new nested links object
import { DEFAULT_LINKS_header } from '@/store/AppContext';

// At the top of DesktopNav.tsx (or .jsx, but use .tsx for TS support)

interface LinkItem {
  label?: string;
  href?: string;
  // ...whatever else you expect
};

interface DesktopNavProps {
  links: LinkItem[];
  onNewsletterClick: () => void;
  categories: object; // use correct type if known
}

// Your component should accept props:
export default function DesktopNav({
 
}: DesktopNavProps) {
return (
    <div className="hidden lg:flex items-center gap-3 min-w-0 flex-shrink">
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-3">
          {/* Loop through all top-level keys */}
          {Object.entries(DEFAULT_LINKS_header).map(([label, data]) => {
            // If this link has sublinks, render as dropdown
            if ('sub' in data && data.sub && typeof data.sub === 'object') {
              return (
                <NavigationMenuItem key={label}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center px-3 py-1 text-sm font-normal min-w-0 text-black"
                      >
                        {label}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border animate-fadeInDown min-w-[160px]"
                    >
                      {Object.entries(data.sub).map(([sublabel, href]) => (
                        <DropdownMenuItem key={sublabel} asChild>
                          <Button
                            asChild
                            variant="ghost"
                            className="w-full text-left py-1 px-3 text-sm font-normal min-w-0 text-black"
                          >
                            <Link href={href as string}  rel="noopener noreferrer">
                              {sublabel}
                            </Link>
                          </Button>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              );
            }

            // Otherwise, render as single link
            if ('href' in data && data.href) {
              return (
                <NavigationMenuItem key={label}>
                  <Button
                    asChild
                    variant="ghost"
                    className="px-3 py-1 text-sm font-normal min-w-0 text-black"
                  >
                    <Link href={data.href}>{label}</Link>
                  </Button>
                </NavigationMenuItem>
              );
            }

            // fallback (ignore unsupported shapes)
            return null;
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
