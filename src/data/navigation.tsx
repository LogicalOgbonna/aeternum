import {
  LayoutDashboard,
  Users,
  MapPin,
  PlayCircle,
  TrendingUp,
  Settings,
  HelpCircle,
  BookOpen,
  BarChart3,
  DollarSign,
  Receipt,
  Banknote,
} from 'lucide-react';
export const mainNav = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Members',
    href: '/members',
    icon: Users,
  },
  {
    name: 'Investments',
    href: '/investments',
    icon: BarChart3,
  },
  {
    name: 'Land Assets',
    href: '/assets',
    icon: MapPin,
  },
  {
    name: 'Dividends',
    href: '/dividends',
    icon: DollarSign,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    icon: Receipt,
  },
  {
    name: 'Lending',
    href: '/lending',
    icon: Banknote,
  },
  {
    name: 'Simulation',
    href: '/simulation',
    icon: PlayCircle,
  },
  {
    name: 'Projections',
    href: '/projections',
    icon: TrendingUp,
  },
];

export const secondaryNav = [
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];
