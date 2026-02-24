'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CaseSelector } from '@/components/case-selector';
import { useCase } from '@/components/case-provider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Briefcase, Heart, Calendar, Cog, UserCog, Scale, FileText, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppNavigation() {
  const pathname = usePathname();
  const { currentCase } = useCase();
  const caseSearch = currentCase ? `?caseId=${currentCase.caseId}&monthYear=${currentCase.monthYear}` : '';

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
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
          <div className="flex items-center gap-1 flex-1">
            {/* Mitarbeiter */}
            <Button
                variant="ghost"
                asChild
                className={cn(isActive('/employees') && 'bg-accent')}
            >
              <Link href={`/employees${caseSearch}`} className="gap-2">
                <Calendar className="h-4 w-4" />
                Mitarbeiter
              </Link>
            </Button>



            {/* Wünsche Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-1',
                    (isActive('/global-wishes-and-blocked') || isActive('/wishes-and-blocked')) && 'bg-accent'
                  )}
                >
                  <Heart className="h-4 w-4" />
                  <span>Wünsche</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href={`/global-wishes-and-blocked${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Allgemeine Wünsche
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/wishes-and-blocked${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Wünsche & Blockierungen
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>



            {/* Konfiguration Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'gap-1',
                    (isActive('/weights') || isActive('/minimal-staff') ) && 'bg-accent'
                  )}
                >
                  <Cog className="h-4 w-4" />
                  <span className="hidden sm:inline">Konfiguration</span>
                  <span className="sm:hidden">Config</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href={`/weights${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <Scale className="h-4 w-4" />
                    Gewichtungen
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/minimal-staff${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <UserCog className="h-4 w-4" />
                    Mindestbesetzung
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dienstplan */}
            <Button
              variant="ghost"
              asChild
              className={cn(isActive('/schedule') && 'bg-accent')}
            >
              <Link href={`/schedule${caseSearch}`} className="gap-2">
                <Calendar className="h-4 w-4" />
                Dienstplan
              </Link>
            </Button>


            {/* Solver */}
            <Button
              variant="ghost"
              asChild
              className={cn(isActive('/solver') && 'bg-accent')}
            >
              <Link href={`/solver${caseSearch}`} className="gap-2">
                <Cog className="h-4 w-4" />
                Solver
              </Link>
            </Button>

            {/* Stammdaten Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        'gap-1',
                        (isActive('/templates') || isActive('/templates/weights')) && 'bg-accent'
                    )}
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href={`/templates${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Alle Templates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/templates/weights${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <Scale className="h-4 w-4" />
                    Gewichtungs-Templates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/templates/global-wishes${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Wünsche-Templates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/templates/minimal-staff${caseSearch}`} className="flex items-center gap-2 cursor-pointer">
                    <UserCog className="h-4 w-4" />
                    Mindestbesetzung-Templates
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
