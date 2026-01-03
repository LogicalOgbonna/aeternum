'use client';

import Link from 'next/link';
import { Building2, ArrowLeft, Menu, Search } from 'lucide-react';

interface DocsHeaderProps {
  onMenuClick?: () => void;
}

export function DocsHeader({ onMenuClick }: DocsHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-(--color-surface)/95 backdrop-blur-sm border-b border-(--color-border) z-50">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-secondary) flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link 
            href="/" 
            className="hidden sm:flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-text) transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          
          <div className="hidden sm:block w-px h-6 bg-(--color-border) flex-shrink-0" />
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-(--color-primary-dark)" />
            </div>
            <div className="min-w-0">
              <h1 className="font-semibold text-(--color-text) truncate">Documentation</h1>
            </div>
          </div>
        </div>

        {/* Search - Desktop only */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search docs..."
              className="w-48 lg:w-64 px-4 py-2 text-sm bg-(--color-primary-dark) border border-(--color-border) rounded-lg text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent)"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-(--color-text-muted) bg-(--color-surface) px-1.5 py-0.5 rounded border border-(--color-border)">
              ⌘K
            </kbd>
          </div>
        </div>
        
        {/* Mobile search button */}
        <button className="md:hidden p-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-secondary)">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
