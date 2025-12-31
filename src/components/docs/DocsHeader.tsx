'use client';

import Link from 'next/link';
import { Building2, ArrowLeft } from 'lucide-react';

export function DocsHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-(--color-surface)/95 backdrop-blur-sm border-b border-(--color-border) z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-(--color-text-secondary) hover:text-(--color-text) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="w-px h-6 bg-(--color-border)" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center">
              <Building2 className="w-4 h-4 text-(--color-primary-dark)" />
            </div>
            <div>
              <h1 className="font-semibold text-(--color-text)">Documentation</h1>
            </div>
          </div>
        </div>

        {/* Search (placeholder for future) */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search docs..."
              className="w-64 px-4 py-2 text-sm bg-(--color-primary-dark) border border-(--color-border) rounded-lg text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent)"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-(--color-text-muted) bg-(--color-surface) px-1.5 py-0.5 rounded border border-(--color-border)">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
    </header>
  );
}



