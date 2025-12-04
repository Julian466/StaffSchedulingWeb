'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { CaseSelector } from '@/components/case-selector';
import { Separator } from '@/components/ui/separator';
import { Users, Briefcase, Heart, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 min-w-fit hover:opacity-80 transition-opacity">
            <Briefcase className="h-6 w-6" />
            <span className="font-semibold text-lg hidden sm:inline">
              Schichtplan Manager
            </span>
          </Link>

          {/* Navigation Links */}
          <NavigationMenu className="flex-1 max-w-none justify-start">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/wishes-and-blocked"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/wishes-and-blocked') && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Wünsche & Blockierungen</span>
                    <span className="sm:hidden">Wünsche</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/employees"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/employees') && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Mitarbeiter
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/schedule"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/schedule') && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Dienstplan
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Separator orientation="vertical" className="h-8 hidden lg:block" />

          {/* Case Selector */}
          <div className="min-w-fit">
            <CaseSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
