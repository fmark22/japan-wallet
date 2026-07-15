import React from 'react';
import { useStore } from '../store/useStore';
import type { CoinType } from '../store/useStore';
import { Minus, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export const Coin: React.FC = () => {
  const { coins, updateCoinCount, budgetJPY } = useStore();

  const coinConfigs: { type: CoinType; label: string; bgPos: string; sizeClass: string }[] = [
    { type: 500, label: '500엔', bgPos: '100% 100%', sizeClass: 'w-24 h-24' },
    { type: 100, label: '100엔', bgPos: '50% 100%', sizeClass: 'w-20 h-20' },
    { type: 50, label: '50엔', bgPos: '0% 100%', sizeClass: 'w-16 h-16' },
    { type: 10, label: '10엔', bgPos: '100% 0%', sizeClass: 'w-16 h-16' },
    { type: 5, label: '5엔', bgPos: '50% 0%', sizeClass: 'w-14 h-14' },
    { type: 1, label: '1엔', bgPos: '0% 0%', sizeClass: 'w-12 h-12' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-[100px] bg-background-regular">
      <div className="px-5 pt-16 pb-4">
        <h1 className="text-display2 font-bold text-text-strong leading-tight tracking-tight">
          내 동전 지갑
        </h1>
      </div>
      
      <div className="px-4 py-4 flex flex-col items-center">
        <div className="w-full max-w-sm mb-10">
          <div className="rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden bg-[#2563EB]">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-[0.08] rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col space-y-2 relative z-10 text-center">
              <span className="text-body2 text-white/80 font-medium tracking-wide">현재 보유한 동전 총액</span>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-[40px] leading-tight tracking-tight font-bold">
                  {budgetJPY.cash_coin.toLocaleString()}
                </span>
                <span className="text-title1 font-medium text-white/90">엔</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 w-full max-w-sm">
          {coinConfigs.map(({ type, label, bgPos, sizeClass }) => (
            <div key={type} className="flex flex-col items-center justify-end space-y-4">
              <div className="h-24 flex items-end justify-center">
                <button
                  className={clsx(
                    "relative rounded-full shadow-lg transition-transform active:scale-95 bg-no-repeat drop-shadow-md",
                    sizeClass
                  )}
                  style={{
                    backgroundImage: 'url(/coin.png)',
                    backgroundSize: '300% 200%',
                    backgroundPosition: bgPos
                  }}
                  onClick={() => updateCoinCount(type, 1)}
                  aria-label={`${label} 추가`}
                >
                  <span className="sr-only">{label}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-border-regular">
                <button 
                  onClick={() => updateCoinCount(type, -1)}
                  disabled={coins[type] === 0}
                  className="p-1 rounded-full text-text-secondary active:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center text-title3 text-text-strong font-medium">
                  {coins[type]}
                </span>
                <button 
                  onClick={() => updateCoinCount(type, 1)}
                  className="p-1 rounded-full text-text-secondary active:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
