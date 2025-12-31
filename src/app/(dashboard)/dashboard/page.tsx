'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { getMemberBalances, formatNaira, formatPercentage, getTotalContributions, getTotalLandValue, getUnrealizedGains, getTotalInvestmentsValue, getInvestableCash, getExpenseReserve } from '@/lib/calculations';
import { StatCard } from '@/components/dashboard/StatCard';
import { NAVChart } from '@/components/dashboard/NAVChart';
import { OwnershipChart } from '@/components/dashboard/OwnershipChart';
import { ExpenseReport } from '@/components/dashboard/ExpenseReport';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MembersTable } from '@/components/dashboard/MembersTable';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  MapPin,
  Coins,
  PiggyBank,
  ChevronRight,
  PlayCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  const balances = getMemberBalances(store);
  const totalContributions = getTotalContributions(store);
  const totalLandValue = getTotalLandValue(store);
  const totalInvestmentsValue = getTotalInvestmentsValue(store);
  const unrealizedGains = getUnrealizedGains(store);
  const gainPercentage = totalContributions > 0 ? (unrealizedGains / totalContributions) * 100 : 0;
  const activeMembers = store.members.filter(m => m.isActive).length;
  const activeInvestments = (store.investments || []).filter(i => i.isActive).length;
  const investableCash = getInvestableCash(store);
  const expenseReserve = getExpenseReserve(store);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Dashboard</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Overview of {store.fundName}
          </p>
        </div>
        <Link href="/simulation" className="btn-primary flex items-center gap-2">
          <PlayCircle className="w-4 h-4" />
          Run Simulation
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Net Asset Value"
          value={formatNaira(store.nav)}
          subtitle="Total fund value"
          icon={<Wallet className="w-5 h-5" />}
          variant="accent"
          trend={gainPercentage !== 0 ? { value: gainPercentage, label: 'Total gain' } : undefined}
        />
        <StatCard
          title="Unit Price"
          value={`₦${store.unitPrice.toFixed(2)}`}
          subtitle={`Started at ₦${store.initialUnitPrice.toFixed(2)}`}
          icon={<Coins className="w-5 h-5" />}
          variant="gold"
          trend={{
            value: ((store.unitPrice - store.initialUnitPrice) / store.initialUnitPrice) * 100,
            label: 'Growth',
          }}
        />
        <StatCard
          title="Total Contributions"
          value={formatNaira(totalContributions)}
          subtitle={`${store.totalUnits.toLocaleString()} units issued`}
          icon={<PiggyBank className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Active Members"
          value={activeMembers.toString()}
          subtitle={`of ${store.members.length} total`}
          icon={<Users className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Cash"
          value={formatNaira(store.moneyMarketBalance)}
          subtitle={expenseReserve > 0 ? `${formatNaira(investableCash)} investable (${formatNaira(expenseReserve)} reserved)` : `${formatPercentage(store.moneyMarketRate)} annual return`}
          icon={<Wallet className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Investments"
          value={formatNaira(totalInvestmentsValue)}
          subtitle={`${activeInvestments} active investments`}
          icon={<BarChart3 className="w-5 h-5" />}
          variant="accent"
        />
        <StatCard
          title="Land Assets"
          value={formatNaira(totalLandValue)}
          subtitle={`${store.landAssets.filter(l => l.status === 'held').length} properties held`}
          icon={<MapPin className="w-5 h-5" />}
          variant="gold"
        />
        <StatCard
          title="Unrealized Gains"
          value={formatNaira(Math.abs(unrealizedGains))}
          subtitle={unrealizedGains >= 0 ? 'Profit' : 'Loss'}
          icon={<TrendingUp className="w-5 h-5" />}
          variant={unrealizedGains >= 0 ? 'success' : 'default'}
          trend={{ value: gainPercentage, label: 'ROI' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NAVChart snapshots={store.monthSnapshots} startDate={new Date(store.startDate)} />
        <OwnershipChart members={store.members} balances={balances} />
      </div>

      {/* Activity, Expenses, and Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MembersTable members={store.members} balances={balances} />
        </div>
        <div className="space-y-6">
          <ExpenseReport state={store} />
          <RecentActivity events={store.events} maxItems={4} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-(--color-surface) rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 h-32 animate-pulse">
            <div className="h-10 w-10 bg-(--color-surface-elevated) rounded-lg mb-4" />
            <div className="h-4 w-24 bg-(--color-surface-elevated) rounded mb-2" />
            <div className="h-6 w-32 bg-(--color-surface-elevated) rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}



