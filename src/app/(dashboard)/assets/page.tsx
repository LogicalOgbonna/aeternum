'use client';

import {
  formatNaira,
  formatPercentage,
  getTotalLandValue,
} from '@/lib/calculations';
import { useFundStore } from '@/lib/store';
import { LandAsset } from '@/lib/types';
import clsx from 'clsx';
import {
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  TrendingUp,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AssetsPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState<LandAsset | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) {
    return <div className='animate-pulse'>Loading...</div>;
  }

  const heldAssets = store.landAssets.filter((l) => l.status === 'held');
  const soldAssets = store.landAssets.filter((l) => l.status === 'sold');
  const totalLandValue = getTotalLandValue(store);
  const totalPurchasePrice = heldAssets.reduce(
    (sum, l) => sum + l.purchasePrice,
    0
  );
  const totalAppreciation = totalLandValue - totalPurchasePrice;

  const handleSell = (land: LandAsset) => {
    setSelectedLand(land);
    setShowSellModal(true);
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-(--color-text)'>
            Land Assets
          </h1>
          <p className='text-(--color-text-secondary) mt-1'>
            Manage the fund&apos;s real estate portfolio
          </p>
        </div>
        <button
          onClick={() => setShowBuyModal(true)}
          className='btn-primary flex items-center gap-2'
          disabled={store.moneyMarketBalance < 10_000_000}
        >
          <Plus className='w-4 h-4' />
          Purchase Land
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='card p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-(--color-gold)' />
            </div>
            <div>
              <p className='text-sm text-(--color-text-secondary)'>
                Properties Held
              </p>
              <p className='text-xl font-bold text-(--color-text)'>
                {heldAssets.length}
              </p>
            </div>
          </div>
        </div>
        <div className='card p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center'>
              <DollarSign className='w-5 h-5 text-(--color-accent)' />
            </div>
            <div>
              <p className='text-sm text-(--color-text-secondary)'>
                Portfolio Value
              </p>
              <p className='text-xl font-bold text-(--color-text) mono'>
                {formatNaira(totalLandValue)}
              </p>
            </div>
          </div>
        </div>
        <div className='card p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center'>
              <TrendingUp className='w-5 h-5 text-(--color-success)' />
            </div>
            <div>
              <p className='text-sm text-(--color-text-secondary)'>
                Appreciation
              </p>
              <p
                className={clsx(
                  'text-xl font-bold mono',
                  totalAppreciation >= 0
                    ? 'text-(--color-success)'
                    : 'text-(--color-danger)'
                )}
              >
                {totalAppreciation >= 0 ? '+' : ''}
                {formatNaira(totalAppreciation)}
              </p>
            </div>
          </div>
        </div>
        <div className='card p-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center'>
              <Building2 className='w-5 h-5 text-(--color-info)' />
            </div>
            <div>
              <p className='text-sm text-(--color-text-secondary)'>
                Available Cash
              </p>
              <p className='text-xl font-bold text-(--color-text) mono'>
                {formatNaira(store.moneyMarketBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Held Properties */}
      <div className='card overflow-hidden'>
        <div className='p-6 border-b border-(--color-border)'>
          <h3 className='text-lg font-semibold text-(--color-text)'>
            Current Holdings
          </h3>
        </div>

        {heldAssets.length === 0 ? (
          <div className='p-12 text-center'>
            <MapPin className='w-12 h-12 text-(--color-text-muted) mx-auto mb-4' />
            <p className='text-(--color-text-secondary)'>No land assets yet</p>
            <p className='text-sm text-(--color-text-muted) mt-1'>
              Purchase your first property to start building the portfolio
            </p>
            <button
              onClick={() => setShowBuyModal(true)}
              className='btn-primary mt-4'
              disabled={store.moneyMarketBalance < 10_000_000}
            >
              Purchase Land
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6'>
            {heldAssets.map((land) => {
              const appreciation = land.currentValue - land.purchasePrice;
              const appreciationPct = (appreciation / land.purchasePrice) * 100;

              // Calculate how long the land has been held
              const monthsHeld = store.currentMonth - land.purchaseMonth;
              const yearsHeld = Math.floor(monthsHeld / 12);
              const remainingMonths = monthsHeld % 12;

              // Format the duration string
              let durationStr = '';
              if (yearsHeld > 0 && remainingMonths > 0) {
                durationStr = `${yearsHeld}y ${remainingMonths}m`;
              } else if (yearsHeld > 0) {
                durationStr = `${yearsHeld} year${yearsHeld > 1 ? 's' : ''}`;
              } else {
                durationStr = `${monthsHeld} month${
                  monthsHeld !== 1 ? 's' : ''
                }`;
              }

              return (
                <div
                  key={land.id}
                  className='p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-gold)/50 transition-colors'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h4 className='font-semibold text-(--color-text)'>
                        {land.name}
                      </h4>
                      <p className='text-sm text-(--color-text-muted) flex items-center gap-1 mt-1'>
                        <MapPin className='w-3 h-3' />
                        {land.location}
                      </p>
                    </div>
                    <span className='badge badge-success'>Held</span>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-(--color-text-secondary)'>
                        Purchase Price
                      </span>
                      <span className='mono text-(--color-text)'>
                        {formatNaira(land.purchasePrice)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-(--color-text-secondary)'>
                        Current Value
                      </span>
                      <span className='mono font-semibold text-(--color-accent)'>
                        {formatNaira(land.currentValue)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-(--color-text-secondary)'>
                        Appreciation
                      </span>
                      <span
                        className={clsx(
                          'mono',
                          appreciation >= 0
                            ? 'text-(--color-success)'
                            : 'text-(--color-danger)'
                        )}
                      >
                        {appreciation >= 0 ? '+' : ''}
                        {appreciationPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-(--color-text-secondary)'>
                        Annual Rate
                      </span>
                      <span className='mono text-(--color-gold)'>
                        {formatPercentage(land.appreciationRate)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center pt-2 border-t border-(--color-border)/50'>
                      <span className='text-sm text-(--color-text-secondary) flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        Held For
                      </span>
                      <span className='mono text-(--color-info)'>
                        {durationStr}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSell(land)}
                    className='btn-secondary w-full mt-4'
                  >
                    Sell Property
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sold Properties */}
      {soldAssets.length > 0 && (
        <div className='card overflow-hidden'>
          <div className='p-6 border-b border-(--color-border)'>
            <h3 className='text-lg font-semibold text-(--color-text)'>
              Sold Properties
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th className='text-right'>Purchase Price</th>
                  <th className='text-right'>Sale Price</th>
                  <th className='text-right'>Profit</th>
                  <th className='text-center'>Held For</th>
                  <th>Sold Month</th>
                </tr>
              </thead>
              <tbody>
                {soldAssets.map((land) => {
                  const profit = (land.soldPrice || 0) - land.purchasePrice;
                  const monthsHeld = (land.soldMonth || 0) - land.purchaseMonth;
                  const yearsHeld = Math.floor(monthsHeld / 12);
                  const remainingMonths = monthsHeld % 12;
                  let durationStr = '';
                  if (yearsHeld > 0 && remainingMonths > 0) {
                    durationStr = `${yearsHeld}y ${remainingMonths}m`;
                  } else if (yearsHeld > 0) {
                    durationStr = `${yearsHeld}y`;
                  } else {
                    durationStr = `${monthsHeld}m`;
                  }

                  return (
                    <tr key={land.id}>
                      <td className='font-medium text-(--color-text)'>
                        {land.name}
                      </td>
                      <td className='text-(--color-text-secondary)'>
                        {land.location}
                      </td>
                      <td className='text-right mono'>
                        {formatNaira(land.purchasePrice)}
                      </td>
                      <td className='text-right mono'>
                        {formatNaira(land.soldPrice || 0)}
                      </td>
                      <td
                        className={clsx(
                          'text-right mono font-medium',
                          profit >= 0
                            ? 'text-(--color-success)'
                            : 'text-(--color-danger)'
                        )}
                      >
                        {profit >= 0 ? '+' : ''}
                        {formatNaira(profit)}
                      </td>
                      <td className='text-center mono text-(--color-info)'>
                        {durationStr}
                      </td>
                      <td className='mono'>{land.soldMonth}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && (
        <BuyLandModal
          availableCash={store.moneyMarketBalance}
          onClose={() => setShowBuyModal(false)}
        />
      )}

      {/* Sell Modal */}
      {showSellModal && selectedLand && (
        <SellLandModal
          land={selectedLand}
          onClose={() => {
            setShowSellModal(false);
            setSelectedLand(null);
          }}
        />
      )}
    </div>
  );
}

function BuyLandModal({
  availableCash,
  onClose,
}: {
  availableCash: number;
  onClose: () => void;
}) {
  const { buyLand } = useFundStore();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [appreciationRate, setAppreciationRate] = useState('20');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (name && location && priceNum > 0 && priceNum <= availableCash) {
      buyLand(name, location, priceNum, parseFloat(appreciationRate) / 100);
      onClose();
    }
  };

  const priceNum = parseFloat(price) || 0;
  const isValidPrice = priceNum > 0 && priceNum <= availableCash;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content p-6' onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-(--color-text)'>
            Purchase Land
          </h2>
          <button
            onClick={onClose}
            className='text-(--color-text-muted) hover:text-(--color-text)'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-3 rounded-lg bg-(--color-info)/10 border border-(--color-info)/30 mb-6'>
          <p className='text-sm text-(--color-text)'>
            Available Cash:{' '}
            <span className='font-semibold mono'>
              {formatNaira(availableCash)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-(--color-text-secondary) mb-2'>
              Property Name
            </label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='input'
              placeholder='e.g., Lekki Phase 2 Plot'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-(--color-text-secondary) mb-2'>
              Location
            </label>
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className='input'
              placeholder='e.g., Lekki, Lagos'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-(--color-text-secondary) mb-2'>
              Purchase Price (₦)
            </label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={clsx(
                'input mono',
                !isValidPrice && price && 'border-(--color-danger)'
              )}
              min='1000000'
              max={availableCash}
              step='100000'
              required
            />
            {!isValidPrice && price && (
              <p className='text-xs text-(--color-danger) mt-1'>
                Price must be between ₦1M and available cash
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-(--color-text-secondary) mb-2'>
              Expected Annual Appreciation (%)
            </label>
            <input
              type='number'
              value={appreciationRate}
              onChange={(e) => setAppreciationRate(e.target.value)}
              className='input mono'
              min='5'
              max='50'
              step='1'
              required
            />
            <p className='text-xs text-(--color-text-muted) mt-1'>
              Typical range: 15-25% for good locations
            </p>
          </div>

          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='btn-secondary flex-1'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn-primary flex-1'
              disabled={!isValidPrice || !name || !location}
            >
              Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SellLandModal({
  land,
  onClose,
}: {
  land: LandAsset;
  onClose: () => void;
}) {
  const store = useFundStore();
  const { sellLandAsset } = store;
  const profit = land.currentValue - land.purchasePrice;
  const profitPct = (profit / land.purchasePrice) * 100;

  // Calculate holding duration
  const monthsHeld = store.currentMonth - land.purchaseMonth;
  const yearsHeld = Math.floor(monthsHeld / 12);
  const remainingMonths = monthsHeld % 12;
  let durationStr = '';
  if (yearsHeld > 0 && remainingMonths > 0) {
    durationStr = `${yearsHeld} year${
      yearsHeld > 1 ? 's' : ''
    }, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  } else if (yearsHeld > 0) {
    durationStr = `${yearsHeld} year${yearsHeld > 1 ? 's' : ''}`;
  } else {
    durationStr = `${monthsHeld} month${monthsHeld !== 1 ? 's' : ''}`;
  }

  const handleSell = () => {
    sellLandAsset(land.id);
    onClose();
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content p-6' onClick={(e) => e.stopPropagation()}>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold text-(--color-text)'>
            Sell Property
          </h2>
          <button
            onClick={onClose}
            className='text-(--color-text-muted) hover:text-(--color-text)'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 rounded-lg bg-(--color-primary-dark) mb-6'>
          <h3 className='font-semibold text-(--color-text)'>{land.name}</h3>
          <p className='text-sm text-(--color-text-muted)'>{land.location}</p>
        </div>

        <div className='space-y-3 mb-6'>
          <div className='flex justify-between py-2 border-b border-(--color-border)'>
            <span className='text-(--color-text-secondary)'>
              Purchase Price
            </span>
            <span className='mono text-(--color-text)'>
              {formatNaira(land.purchasePrice)}
            </span>
          </div>
          <div className='flex justify-between py-2 border-b border-(--color-border)'>
            <span className='text-(--color-text-secondary)'>Current Value</span>
            <span className='mono font-semibold text-(--color-accent)'>
              {formatNaira(land.currentValue)}
            </span>
          </div>
          <div className='flex justify-between py-2 border-b border-(--color-border)'>
            <span className='text-(--color-text-secondary)'>Profit/Loss</span>
            <span
              className={clsx(
                'mono font-semibold',
                profit >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
              )}
            >
              {profit >= 0 ? '+' : ''}
              {formatNaira(profit)} ({profitPct.toFixed(1)}%)
            </span>
          </div>
          <div className='flex justify-between py-2'>
            <span className='text-(--color-text-secondary) flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              Holding Period
            </span>
            <span className='mono text-(--color-info)'>{durationStr}</span>
          </div>
        </div>

        <div className='p-3 rounded-lg bg-(--color-warning)/10 border border-(--color-warning)/30 mb-6'>
          <div className='flex items-start gap-2'>
            <AlertTriangle className='w-4 h-4 text-(--color-warning) flex-shrink-0 mt-0.5' />
            <p className='text-sm text-(--color-text)'>
              Proceeds will be added to the money market balance.
            </p>
          </div>
        </div>

        <div className='flex gap-3'>
          <button onClick={onClose} className='btn-secondary flex-1'>
            Cancel
          </button>
          <button onClick={handleSell} className='btn-primary flex-1'>
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
}
