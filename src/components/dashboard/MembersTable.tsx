'use client';

import { Member, MemberBalance } from '@/lib/types';
import { formatNaira, formatPercentage, formatNumber } from '@/lib/calculations';
import { profileColors } from '@/lib/personas';
import clsx from 'clsx';

interface MembersTableProps {
  members: Member[];
  balances: MemberBalance[];
}

export function MembersTable({ members, balances }: MembersTableProps) {
  const activeMembers = members.filter((m) => m.isActive);

  const getMemberBalance = (memberId: string) => {
    return balances.find((b) => b.memberId === memberId);
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-(--color-border)">
        <h3 className="text-base sm:text-lg font-semibold text-(--color-text)">Member Overview</h3>
        <p className="text-xs sm:text-sm text-(--color-text-muted) mt-1">
          {activeMembers.length} active members
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden divide-y divide-(--color-border)">
        {activeMembers.map((member) => {
          const balance = getMemberBalance(member.id);
          const gain = balance
            ? balance.currentValue - balance.totalContributed
            : 0;
          const gainPct = balance && balance.totalContributed > 0
            ? (gain / balance.totalContributed) * 100
            : 0;

          return (
            <div key={member.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                    style={{
                      backgroundColor: `${profileColors[member.profile]}20`,
                      color: profileColors[member.profile],
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-(--color-text) text-sm">{member.name}</p>
                    <span
                      className="badge text-xs"
                      style={{
                        backgroundColor: `${profileColors[member.profile]}20`,
                        color: profileColors[member.profile],
                      }}
                    >
                      {member.profile}
                    </span>
                  </div>
                </div>
                <span className="badge badge-success text-xs">Active</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-(--color-text-muted) text-xs">Units</p>
                  <p className="mono font-medium text-(--color-text)">{balance ? formatNumber(balance.totalUnits, 2) : '0'}</p>
                </div>
                <div>
                  <p className="text-(--color-text-muted) text-xs">Ownership</p>
                  <p className="mono font-medium text-(--color-text)">{balance ? formatPercentage(balance.ownershipPercentage) : '0%'}</p>
                </div>
                <div>
                  <p className="text-(--color-text-muted) text-xs">Contributed</p>
                  <p className="mono font-medium text-(--color-text)">{balance ? formatNaira(balance.totalContributed) : '₦0'}</p>
                </div>
                <div>
                  <p className="text-(--color-text-muted) text-xs">Current Value</p>
                  <div>
                    <p className="mono font-medium text-(--color-text)">
                      {balance ? formatNaira(balance.currentValue) : '₦0'}
                    </p>
                    {balance && balance.totalContributed > 0 && (
                      <p
                        className={clsx(
                          'text-xs mono',
                          gain >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
                        )}
                      >
                        {gain >= 0 ? '+' : ''}
                        {gainPct.toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Profile</th>
              <th className="text-right">Units</th>
              <th className="text-right">Ownership</th>
              <th className="text-right">Contributed</th>
              <th className="text-right">Current Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activeMembers.map((member) => {
              const balance = getMemberBalance(member.id);
              const gain = balance
                ? balance.currentValue - balance.totalContributed
                : 0;
              const gainPct = balance && balance.totalContributed > 0
                ? (gain / balance.totalContributed) * 100
                : 0;

              return (
                <tr key={member.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                        style={{
                          backgroundColor: `${profileColors[member.profile]}20`,
                          color: profileColors[member.profile],
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-(--color-text)">{member.name}</p>
                        <p className="text-xs text-(--color-text-muted)">
                          Base: {formatNaira(member.baseContribution)}/mo
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${profileColors[member.profile]}20`,
                        color: profileColors[member.profile],
                      }}
                    >
                      {member.profile}
                    </span>
                  </td>
                  <td className="text-right mono">
                    {balance ? formatNumber(balance.totalUnits, 2) : '0'}
                  </td>
                  <td className="text-right mono">
                    {balance ? formatPercentage(balance.ownershipPercentage) : '0%'}
                  </td>
                  <td className="text-right mono">
                    {balance ? formatNaira(balance.totalContributed) : '₦0'}
                  </td>
                  <td className="text-right">
                    <div>
                      <p className="mono font-medium text-(--color-text)">
                        {balance ? formatNaira(balance.currentValue) : '₦0'}
                      </p>
                      {balance && balance.totalContributed > 0 && (
                        <p
                          className={clsx(
                            'text-xs mono',
                            gain >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
                          )}
                        >
                          {gain >= 0 ? '+' : ''}
                          {gainPct.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
