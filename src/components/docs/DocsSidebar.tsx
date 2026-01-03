'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  BookOpen,
  Scale,
  Users,
  Coins,
  MapPin,
  Calculator,
  Shield,
  FileText,
  HelpCircle,
  X,
} from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs', icon: BookOpen },
      { name: 'How It Works', href: '/docs/how-it-works', icon: HelpCircle },
    ],
  },
  {
    title: 'Constitution',
    items: [
      { name: 'Fund Structure', href: '/docs/fund-structure', icon: Scale },
      { name: 'Membership', href: '/docs/membership', icon: Users },
      { name: 'Contributions', href: '/docs/contributions', icon: Coins },
    ],
  },
  {
    title: 'Operations',
    items: [
      { name: 'Land Acquisition', href: '/docs/land-acquisition', icon: MapPin },
      { name: 'NAV Calculation', href: '/docs/nav-calculation', icon: Calculator },
      { name: 'Distributions', href: '/docs/distributions', icon: FileText },
    ],
  },
  {
    title: 'Governance',
    items: [
      { name: 'Rules & Policies', href: '/docs/rules', icon: Shield },
      { name: 'Amendments', href: '/docs/amendments', icon: FileText },
    ],
  },
];

interface DocsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DocsSidebar({ isOpen = false, onClose }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={clsx(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-(--color-surface) border-r border-(--color-border) overflow-y-auto z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-(--color-border)">
          <span className="font-medium text-(--color-text)">Navigation</span>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-secondary)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider mb-2 px-3">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                        isActive
                          ? 'bg-(--color-accent)/10 text-(--color-accent) font-medium'
                          : 'text-(--color-text-secondary) hover:bg-(--color-surface-elevated) hover:text-(--color-text)'
                      )}
                    >
                      <item.icon className={clsx('w-4 h-4', isActive && 'text-(--color-accent)')} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Version info */}
          <div className="pt-4 mt-6 border-t border-(--color-border)">
            <div className="px-3 py-2">
              <p className="text-xs text-(--color-text-muted)">Constitution Version</p>
              <p className="text-sm font-medium text-(--color-text-secondary)">v1.0.0 — Dec 2024</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
