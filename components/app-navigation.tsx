'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { CaseSelector } from '@/components/case-selector';
import { Separator } from '@/components/ui/separator';
import { Users, Briefcase, Heart, Calendar, Cog, UserCog, Scale, FileText } from 'lucide-react';
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
              {/* Stammdaten Gruppe */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    (isActive('/employees') || isActive('/minimal-staff')) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Stammdaten</span>
                  <span className="sm:hidden">Daten</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[240px] p-2">
                    <li>
                      <Link
                        href="/employees"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/employees') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <div className="text-sm font-medium">Mitarbeiter</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Mitarbeiterverwaltung
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/minimal-staff"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/minimal-staff') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          <div className="text-sm font-medium">Mindestbesetzung</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Besetzungsanforderungen
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Wünsche Gruppe */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    (isActive('/global-wishes-and-blocked') || isActive('/wishes-and-blocked')) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Wünsche</span>
                  <span className="sm:hidden">Wünsche</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[240px] p-2">
                    <li>
                      <Link
                        href="/global-wishes-and-blocked"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/global-wishes-and-blocked') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <div className="text-sm font-medium">Allgemeine Wünsche</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Globale Präferenzen
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/wishes-and-blocked"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/wishes-and-blocked') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <div className="text-sm font-medium">Wünsche & Blockierungen</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Individuelle Präferenzen
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Konfiguration Gruppe */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    (isActive('/weights') || isActive('/templates') || isActive('/templates/weights')) && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Cog className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Konfiguration</span>
                  <span className="sm:hidden">Config</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[240px] p-2">
                    <li>
                      <Link
                        href="/weights"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/weights') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          <div className="text-sm font-medium">Gewichtungen</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Solver-Prioritäten
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/templates"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/templates') && !isActive('/templates/weights') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div className="text-sm font-medium">Templates</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Gespeicherte Vorlagen
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/templates/weights"
                        className={cn(
                          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                          isActive('/templates/weights') && 'bg-accent text-accent-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          <div className="text-sm font-medium">Gewichtungs-Templates</div>
                        </div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Gespeicherte Gewichtungen
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Dienstplan - direkter Link */}
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

              {/* Solver - direkter Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/solver"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/solver') && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Cog className="h-4 w-4 mr-2" />
                    Solver
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
