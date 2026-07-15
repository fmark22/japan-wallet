import React from 'react';
import { useStore } from '../store/useStore';
import { Home, List, Settings, CircleDollarSign } from 'lucide-react';
import { clsx } from 'clsx';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useStore();

  const tabs = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'coin', icon: CircleDollarSign, label: '동전' },
    { id: 'ledger', icon: List, label: '내역' },
    { id: 'settings', icon: Settings, label: '설정' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[60px] bg-white border-t border-border-regular flex items-center justify-around z-40 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center w-full h-full space-y-[2px]"
          >
            <Icon 
              size={24} 
              className={clsx(
                "transition-colors",
                isActive ? "text-primary-regular" : "text-text-tertiary"
              )} 
            />
            <span 
              className={clsx(
                "text-caption3",
                isActive ? "text-primary-regular" : "text-text-tertiary"
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
