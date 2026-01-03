'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  PlayCircle, 
  TrendingUp,
  Building2,
  Settings,
  HelpCircle,
  BookOpen,
  BarChart3,
  DollarSign,
  Receipt,
  X
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Investments', href: '/investments', icon: BarChart3 },
  { name: 'Land Assets', href: '/assets', icon: MapPin },
  { name: 'Dividends', href: '/dividends', icon: DollarSign },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Simulation', href: '/simulation', icon: PlayCircle },
  { name: 'Projections', href: '/projections', icon: TrendingUp },
];

const secondaryNav = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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
        "fixed left-0 top-0 h-screen w-64 bg-(--color-surface) border-r border-(--color-border) flex flex-col z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-(--color-border) flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-accent) to-(--color-gold) flex items-center justify-center">
              <Building2 className="w-5 h-5 text-(--color-primary-dark)" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-(--color-text)">Aeternum</h1>
              <p className="text-xs text-(--color-text-muted)">Syndicate</p>
            </div>
          </Link>
          {/* Mobile close button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-secondary)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-(--color-accent)/10 text-(--color-accent) font-medium'
                    : 'text-(--color-text-secondary) hover:bg-(--color-surface-elevated) hover:text-(--color-text)'
                )}
              >
                <item.icon className={clsx('w-5 h-5', isActive && 'text-(--color-accent)')} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-(--color-accent)" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Secondary Navigation */}
        <div className="p-4 border-t border-(--color-border)">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-(--color-surface-elevated) text-(--color-text)'
                    : 'text-(--color-text-muted) hover:bg-(--color-surface-elevated) hover:text-(--color-text-secondary)'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Fund Status */}
        <div className="p-4 m-4 rounded-xl bg-linear-to-br from-(--color-accent)/10 to-(--color-gold)/10 border border-(--color-accent)/20">
          <p className="text-xs font-medium text-(--color-text-secondary) mb-1">Simulation Mode</p>
          <p className="text-sm font-semibold text-(--color-accent)">Active</p>
        </div>
      </aside>
    </>
  );
}
