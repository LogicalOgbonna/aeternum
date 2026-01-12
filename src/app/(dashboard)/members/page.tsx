'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { getMemberBalances, getMemberStatement, formatNaira, formatPercentage, formatNumber, getMonthName } from '@/lib/calculations';
import { profileColors, profileDescriptions } from '@/lib/personas';
import { MemberProfile, Member } from '@/lib/types';
import { 
  Users, 
  UserPlus, 
  X, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Coins,
  Calendar,
  AlertTriangle,
  UserMinus,
  Gift,
  Banknote
} from 'lucide-react';
import clsx from 'clsx';

export default function MembersPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showStatementModal, setShowStatementModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const balances = getMemberBalances(store);
  const activeMembers = store.members.filter(m => m.isActive);
  const inactiveMembers = store.members.filter(m => !m.isActive);

  const handleViewStatement = (member: Member) => {
    setSelectedMember(member);
    setShowStatementModal(true);
  };

  const handleExitMember = (member: Member) => {
    setSelectedMember(member);
    setShowExitModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Members</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Manage fund members and view individual statements
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Active Members</p>
              <p className="text-xl font-bold text-(--color-text)">{activeMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-warning)/10 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Exited Members</p>
              <p className="text-xl font-bold text-(--color-text)">{inactiveMembers.length}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Total Units</p>
              <p className="text-xl font-bold text-(--color-text) mono">
                {formatNumber(store.totalUnits, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Unit Price</p>
              <p className="text-xl font-bold text-(--color-text) mono">
                ₦{store.unitPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Members Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border)">
          <h3 className="text-lg font-semibold text-(--color-text)">Active Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Profile</th>
                <th className="text-right">Base Contribution</th>
                <th className="text-right">Units</th>
                <th className="text-right">Ownership</th>
                <th className="text-right">Value</th>
                <th className="text-right">Gain/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((member) => {
                const balance = balances.find(b => b.memberId === member.id);
                const gain = balance ? balance.currentValue - balance.totalContributed : 0;
                const gainPct = balance && balance.totalContributed > 0
                  ? (gain / balance.totalContributed) * 100 : 0;

                return (
                  <tr key={member.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                          style={{
                            backgroundColor: `${profileColors[member.profile]}20`,
                            color: profileColors[member.profile],
                          }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-(--color-text)">{member.name}</p>
                          <p className="text-xs text-(--color-text-muted)">
                            Joined Month {member.joinedMonth}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${profileColors[member.profile]}20`,
                            color: profileColors[member.profile],
                          }}
                        >
                          {member.profile}
                        </span>
                        <p className="text-xs text-(--color-text-muted) mt-1 max-w-[150px]">
                          {profileDescriptions[member.profile]}
                        </p>
                      </div>
                    </td>
                    <td className="text-right mono">{formatNaira(member.baseContribution)}</td>
                    <td className="text-right mono">{balance ? formatNumber(balance.totalUnits, 2) : '0'}</td>
                    <td className="text-right mono">{balance ? formatPercentage(balance.ownershipPercentage) : '0%'}</td>
                    <td className="text-right mono font-medium">{balance ? formatNaira(balance.currentValue) : '₦0'}</td>
                    <td className="text-right">
                      <div className={clsx(
                        'flex items-center justify-end gap-1',
                        gain >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
                      )}>
                        {gain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="mono">{gainPct.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewStatement(member)}
                          className="btn-secondary text-sm py-1.5 px-3"
                        >
                          Statement
                        </button>
                        <button
                          onClick={() => handleExitMember(member)}
                          className="text-(--color-danger) hover:bg-(--color-danger)/10 p-2 rounded-lg transition-colors"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Members */}
      {inactiveMembers.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-(--color-border)">
            <h3 className="text-lg font-semibold text-(--color-text)">Exited Members</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Exit Reason</th>
                  <th>Exit Month</th>
                  <th className="text-right">Final Units</th>
                </tr>
              </thead>
              <tbody>
                {inactiveMembers.map((member) => {
                  const balance = balances.find(b => b.memberId === member.id);
                  return (
                    <tr key={member.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-(--color-surface-elevated) flex items-center justify-center text-sm font-semibold text-(--color-text-muted)">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <p className="font-medium text-(--color-text-secondary)">{member.name}</p>
                        </div>
                      </td>
                      <td>
                        <span className={clsx(
                          'badge',
                          member.exitReason === 'voluntary' && 'badge-info',
                          member.exitReason === 'default' && 'badge-danger',
                          member.exitReason === 'death' && 'badge-neutral',
                          member.exitReason === 'forced' && 'badge-warning'
                        )}>
                          {member.exitReason}
                        </span>
                      </td>
                      <td className="mono">{member.exitedMonth}</td>
                      <td className="text-right mono">{balance ? formatNumber(balance.totalUnits, 2) : '0'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Exit Member Modal */}
      {showExitModal && selectedMember && (
        <ExitMemberModal
          member={selectedMember}
          onClose={() => {
            setShowExitModal(false);
            setSelectedMember(null);
          }}
        />
      )}

      {/* Statement Modal */}
      {showStatementModal && selectedMember && (
        <StatementModal
          member={selectedMember}
          onClose={() => {
            setShowStatementModal(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
}

function AddMemberModal({ onClose }: { onClose: () => void }) {
  const { addNewMember } = useFundStore();
  const [name, setName] = useState('');
  const [profile, setProfile] = useState<MemberProfile>('consistent');
  const [baseContribution, setBaseContribution] = useState('1000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && baseContribution) {
      addNewMember(name, profile, parseFloat(baseContribution));
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--color-text)">Add New Member</h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text)">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Contribution Profile
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as MemberProfile)}
              className="select"
            >
              <option value="consistent">Consistent - Reliable monthly contributor</option>
              <option value="variable">Variable - Fluctuates with cashflow</option>
              <option value="irregular">Irregular - Significant variance</option>
              <option value="quarterly">Quarterly - Pays every 3 months</option>
              <option value="lumpy">Lumpy - May skip months, pays large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Base Monthly Contribution (₦)
            </label>
            <input
              type="number"
              value={baseContribution}
              onChange={(e) => setBaseContribution(e.target.value)}
              className="input mono"
              min="100000"
              step="50000"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type ExitMethodType = 'fund_payout' | 'company_buyback';

interface BuybackAllocationState {
  memberId: string;
  percentage: number;
}

function ExitMemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const store = useFundStore();
  const { removeMember, removeMemberCompanyBuyback } = store;
  const [reason, setReason] = useState<'voluntary' | 'default' | 'death' | 'forced'>('voluntary');
  const [exitMethod, setExitMethod] = useState<ExitMethodType>('fund_payout');
  
  // Calculate exit value
  const balances = getMemberBalances(store);
  const memberBalance = balances.find(b => b.memberId === member.id);
  const memberUnits = memberBalance?.totalUnits || 0;
  const exitValue = memberUnits * store.unitPrice;
  const hasFullLiquidity = store.moneyMarketBalance >= exitValue;
  const remainingUnitsAfterExit = store.totalUnits - memberUnits;
  
  // Get other active members for buyback options
  const otherActiveMembers = store.members.filter(m => m.isActive && m.id !== member.id);
  
  // Buyback allocations state - initialize with empty allocations
  const [buybackAllocations, setBuybackAllocations] = useState<BuybackAllocationState[]>(
    otherActiveMembers.map(m => ({ memberId: m.id, percentage: 0 }))
  );
  
  // Calculate total allocated percentage
  const totalAllocatedPercentage = buybackAllocations.reduce((sum, a) => sum + a.percentage, 0);
  const isAllocationValid = Math.abs(totalAllocatedPercentage - 100) < 0.01;
  
  // Update allocation for a specific member
  const updateAllocation = (memberId: string, percentage: number) => {
    setBuybackAllocations(prev => 
      prev.map(a => a.memberId === memberId ? { ...a, percentage: Math.max(0, Math.min(100, percentage)) } : a)
    );
  };
  
  // Distribute remaining percentage equally among selected members
  const distributeEqually = () => {
    const equalShare = 100 / otherActiveMembers.length;
    setBuybackAllocations(otherActiveMembers.map(m => ({ memberId: m.id, percentage: equalShare })));
  };

  const handleExit = () => {
    switch (exitMethod) {
      case 'fund_payout':
        removeMember(member.id, reason);
        break;
      case 'company_buyback':
        // Filter out zero allocations
        const validAllocations = buybackAllocations.filter(a => a.percentage > 0);
        removeMemberCompanyBuyback(member.id, reason, validAllocations);
        break;
    }
    onClose();
  };

  const isValidExit = exitMethod === 'fund_payout' || (exitMethod === 'company_buyback' && isAllocationValid);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--color-text)">Exit Member</h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Info */}
        <div className="p-4 rounded-lg bg-(--color-primary-dark) mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              style={{
                backgroundColor: `${profileColors[member.profile]}20`,
                color: profileColors[member.profile],
              }}
            >
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-(--color-text)">{member.name}</p>
              <p className="text-xs text-(--color-text-muted)">{member.profile} contributor</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold mono text-(--color-accent)">{formatNaira(exitValue)}</p>
              <p className="text-xs text-(--color-text-muted)">{formatNumber(memberUnits, 2)} units</p>
            </div>
          </div>
        </div>

        {/* Exit Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-(--color-text-secondary) mb-3">
            Buyback Method
          </label>
          <div className="space-y-2">
            {/* Fund Payout */}
            <label 
              className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                exitMethod === 'fund_payout' 
                  ? 'border-(--color-accent) bg-(--color-accent)/10' 
                  : 'border-(--color-border) bg-(--color-primary-dark) hover:border-(--color-text-muted)'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="exitMethod"
                  value="fund_payout"
                  checked={exitMethod === 'fund_payout'}
                  onChange={() => setExitMethod('fund_payout')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-(--color-text)">Fund Payout</p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    Payout from fund&apos;s available cash. Units are removed from circulation.
                  </p>
                  {!hasFullLiquidity && (
                    <p className="text-xs text-(--color-warning) mt-2">
                      ⚠️ Insufficient liquidity: {formatNaira(store.moneyMarketBalance)} available
                    </p>
                  )}
                </div>
              </div>
            </label>

            {/* Company Buyback */}
            <label 
              className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                exitMethod === 'company_buyback' 
                  ? 'border-(--color-gold) bg-(--color-gold)/10' 
                  : 'border-(--color-border) bg-(--color-primary-dark) hover:border-(--color-text-muted)'
              } ${otherActiveMembers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="exitMethod"
                  value="company_buyback"
                  checked={exitMethod === 'company_buyback'}
                  onChange={() => setExitMethod('company_buyback')}
                  disabled={otherActiveMembers.length === 0}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-(--color-text)">Company Buyback</p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    Shares distributed to remaining members based on their chosen allocation.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Company Buyback - Member Allocation Selection */}
        {exitMethod === 'company_buyback' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-(--color-text-secondary)">
                Buyback Allocation
              </label>
              <button
                type="button"
                onClick={distributeEqually}
                className="text-xs text-(--color-accent) hover:text-(--color-accent)/80 underline"
              >
                Distribute Equally
              </button>
            </div>
            
            {/* Allocation Progress */}
            <div className="mb-4 p-3 rounded-lg bg-(--color-surface-elevated) border border-(--color-border)">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-(--color-text-secondary)">Total Allocated</span>
                <span className={`text-sm font-bold mono ${
                  isAllocationValid ? 'text-(--color-success)' : 'text-(--color-warning)'
                }`}>
                  {totalAllocatedPercentage.toFixed(1)}% / 100%
                </span>
              </div>
              <div className="w-full h-2 bg-(--color-primary-dark) rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    isAllocationValid ? 'bg-(--color-success)' : totalAllocatedPercentage > 100 ? 'bg-(--color-danger)' : 'bg-(--color-warning)'
                  }`}
                  style={{ width: `${Math.min(totalAllocatedPercentage, 100)}%` }}
                />
              </div>
              {!isAllocationValid && (
                <p className="text-xs text-(--color-warning) mt-2">
                  {totalAllocatedPercentage < 100 
                    ? `Allocate ${(100 - totalAllocatedPercentage).toFixed(1)}% more to continue` 
                    : `Over-allocated by ${(totalAllocatedPercentage - 100).toFixed(1)}%`}
                </p>
              )}
            </div>
            
            {/* Member Allocation Inputs */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {otherActiveMembers.map(m => {
                const mBalance = balances.find(b => b.memberId === m.id);
                const allocation = buybackAllocations.find(a => a.memberId === m.id);
                const memberPercentage = allocation?.percentage || 0;
                const unitsForMember = memberUnits * (memberPercentage / 100);
                const costForMember = exitValue * (memberPercentage / 100);
                
                return (
                  <div 
                    key={m.id} 
                    className={`p-3 rounded-lg border transition-colors ${
                      memberPercentage > 0 
                        ? 'border-(--color-gold)/50 bg-(--color-gold)/5' 
                        : 'border-(--color-border) bg-(--color-primary-dark)'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{
                          backgroundColor: `${profileColors[m.profile]}20`,
                          color: profileColors[m.profile],
                        }}
                      >
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-(--color-text) text-sm truncate">{m.name}</p>
                        <p className="text-xs text-(--color-text-muted)">
                          Current: {formatNumber(mBalance?.totalUnits || 0, 2)} units ({formatPercentage(mBalance?.ownershipPercentage || 0)})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={memberPercentage || ''}
                          onChange={(e) => updateAllocation(m.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-sm text-right rounded border border-(--color-border) bg-(--color-surface) text-(--color-text) mono"
                          placeholder="0"
                        />
                        <span className="text-sm text-(--color-text-secondary)">%</span>
                      </div>
                    </div>
                    {memberPercentage > 0 && (
                      <div className="mt-2 pt-2 border-t border-(--color-border) flex justify-between text-xs">
                        <span className="text-(--color-text-muted)">
                          Gets: <span className="mono text-(--color-success)">+{formatNumber(unitsForMember, 2)} units</span>
                        </span>
                        <span className="text-(--color-text-muted)">
                          Pays: <span className="mono text-(--color-warning)">{formatNaira(costForMember)}</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Impact Summary */}
        <div className="p-4 rounded-lg bg-(--color-surface-elevated) border border-(--color-border) mb-4">
          <h3 className="text-sm font-medium text-(--color-text-secondary) mb-3">Impact Summary</h3>
          <div className="space-y-2 text-sm">
            {exitMethod === 'fund_payout' && (
              <>
                <div className="flex justify-between">
                  <span className="text-(--color-text-secondary)">Fund Cash Reduced By</span>
                  <span className="mono text-(--color-error)">-{formatNaira(exitValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-text-secondary)">Total Units After</span>
                  <span className="mono text-(--color-text)">{formatNumber(remainingUnitsAfterExit, 2)}</span>
                </div>
              </>
            )}
            {exitMethod === 'company_buyback' && (
              <>
                <div className="flex justify-between">
                  <span className="text-(--color-text-secondary)">Fund Cash Change</span>
                  <span className="mono text-(--color-text)">No change</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--color-text-secondary)">Total Units</span>
                  <span className="mono text-(--color-text)">No change (redistributed)</span>
                </div>
                {buybackAllocations.filter(a => a.percentage > 0).length > 0 && (
                  <div className="pt-2 border-t border-(--color-border) mt-2">
                    <p className="text-xs text-(--color-text-muted) mb-2">Buying Members:</p>
                    {buybackAllocations
                      .filter(a => a.percentage > 0)
                      .map(a => {
                        const buyingMember = otherActiveMembers.find(m => m.id === a.memberId);
                        const unitsGained = memberUnits * (a.percentage / 100);
                        const costToPay = exitValue * (a.percentage / 100);
                        return (
                          <div key={a.memberId} className="flex justify-between text-xs mb-1">
                            <span className="text-(--color-text)">{buyingMember?.name} ({a.percentage}%)</span>
                            <span className="mono text-(--color-text-muted)">
                              +{formatNumber(unitsGained, 2)} units for {formatNaira(costToPay)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Exit Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
            Exit Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as typeof reason)}
            className="select"
          >
            <option value="voluntary">Voluntary Exit</option>
            <option value="default">Default (Non-payment)</option>
            <option value="death">Death/Incapacity</option>
            <option value="forced">Forced Removal</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button 
            onClick={handleExit} 
            className="btn-danger flex-1"
            disabled={!isValidExit}
          >
            {exitMethod === 'fund_payout' && `Confirm Exit & Pay ${formatNaira(exitValue)}`}
            {exitMethod === 'company_buyback' && 'Confirm Company Buyback'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatementModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const store = useFundStore();
  const statement = getMemberStatement(store, member.id);

  if (!statement) return null;

  // Get dividend details from store dividends
  const memberDividends = (store.dividends || []).map(d => {
    const dist = d.distributions.find(dist => dist.memberId === member.id);
    if (!dist) return null;
    return {
      fiscalYear: d.fiscalYear,
      month: d.month,
      totalProfit: d.totalProfit,
      distributedAmount: d.distributedAmount,
      memberDividend: dist.dividendAmount,
      ownershipAtTime: dist.ownershipPercentage,
    };
  }).filter(Boolean);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-(--color-text)">Member Statement</h2>
            <p className="text-(--color-text-secondary)">{member.name}</p>
          </div>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-(--color-primary-dark)">
            <p className="text-sm text-(--color-text-secondary)">Total Contributed</p>
            <p className="text-xl font-bold text-(--color-text) mono">
              {formatNaira(statement.totalContributed)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-(--color-primary-dark)">
            <p className="text-sm text-(--color-text-secondary)">Current Value</p>
            <p className="text-xl font-bold text-(--color-accent) mono">
              {formatNaira(statement.currentValue)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-(--color-primary-dark)">
            <p className="text-sm text-(--color-text-secondary)">Total Units</p>
            <p className="text-xl font-bold text-(--color-text) mono">
              {formatNumber(statement.totalUnits, 2)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-(--color-primary-dark)">
            <p className="text-sm text-(--color-text-secondary)">Unrealized Gain</p>
            <p className={clsx(
              'text-xl font-bold mono',
              statement.unrealizedGain >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
            )}>
              {statement.unrealizedGain >= 0 ? '+' : ''}{formatNaira(statement.unrealizedGain)}
              <span className="text-sm ml-2">
                ({statement.unrealizedGainPercentage >= 0 ? '+' : ''}{(statement.unrealizedGainPercentage * 100).toFixed(2)}%)
              </span>
            </p>
          </div>
        </div>

        {/* Dividend Summary */}
        <div className="p-4 rounded-lg bg-linear-to-r from-(--color-gold)/10 to-(--color-accent)/10 border border-(--color-gold)/30 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Total Dividends Received</p>
              <p className="text-xl font-bold text-(--color-gold) mono">
                {formatNaira(statement.totalDividendsReceived)}
              </p>
            </div>
          </div>
          <p className="text-xs text-(--color-text-muted)">
            Dividends are distributed at the end of each fiscal year (20% of annual profit)
          </p>
        </div>

        {/* Dividend History */}
        {memberDividends.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="w-4 h-4 text-(--color-gold)" />
              <h3 className="text-sm font-medium text-(--color-text-secondary)">Dividend History</h3>
            </div>
            <div className="space-y-3">
              {memberDividends.map((div, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg bg-(--color-surface-elevated) border border-(--color-border)"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-(--color-text)">
                      Fiscal Year {div!.fiscalYear}
                    </span>
                    <span className="text-lg font-bold text-(--color-gold) mono">
                      {formatNaira(div!.memberDividend)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-(--color-text-muted)">Fund Profit:</span>
                      <span className="mono text-(--color-text) ml-1">{formatNaira(div!.totalProfit)}</span>
                    </div>
                    <div>
                      <span className="text-(--color-text-muted)">Total Distributed:</span>
                      <span className="mono text-(--color-text) ml-1">{formatNaira(div!.distributedAmount)}</span>
                    </div>
                    <div>
                      <span className="text-(--color-text-muted)">Your Ownership:</span>
                      <span className="mono text-(--color-text) ml-1">{formatPercentage(div!.ownershipAtTime)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {memberDividends.length === 0 && (
          <div className="p-4 rounded-lg bg-(--color-primary-dark) text-center mb-6">
            <Gift className="w-8 h-8 text-(--color-text-muted) mx-auto mb-2" />
            <p className="text-sm text-(--color-text-secondary)">No dividends yet</p>
            <p className="text-xs text-(--color-text-muted)">
              Dividends are distributed at the end of each fiscal year (Month 12, 24, 36...)
            </p>
          </div>
        )}

        {/* Contribution History */}
        <div>
          <h3 className="text-sm font-medium text-(--color-text-secondary) mb-3">Contribution History</h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="text-right">Amount</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Units Issued</th>
                </tr>
              </thead>
              <tbody>
                {statement.contributions.map((c, i) => (
                  <tr key={i}>
                    <td className="mono">{getMonthName(c.month, new Date(store.startDate))}</td>
                    <td className="text-right mono">{formatNaira(c.amount)}</td>
                    <td className="text-right mono">₦{c.unitPrice.toFixed(2)}</td>
                    <td className="text-right mono">{formatNumber(c.unitsIssued, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

