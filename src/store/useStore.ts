import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentMethod = 'card1' | 'card2' | 'cash_bill' | 'cash_coin';
export type CoinType = 500 | 100 | 50 | 10 | 5 | 1;

export interface Expense {
  id: string;
  amountJPY: number;
  amountKRW: number;
  method: PaymentMethod;
  category?: string;
  memo?: string;
  date: string; // ISO string
}

interface Budget {
  card1: number;
  card2: number;
  cash_bill: number;
  cash_coin: number;
}

interface AppState {
  activeTab: 'home' | 'coin' | 'ledger' | 'settings';
  exchangeRate: number; // JPY to KRW (e.g., 900 won per 100 JPY -> 9.0)
  budgetJPY: Budget;
  expenses: Expense[];
  coins: Record<CoinType, number>;
  
  setActiveTab: (tab: 'home' | 'coin' | 'ledger' | 'settings') => void;
  setExchangeRate: (rate: number) => void;
  setBudget: (method: PaymentMethod, amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  editExpense: (id: string, updatedExpense: Omit<Expense, 'id' | 'date'>) => void;
  updateCoinCount: (coin: CoinType, delta: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'home',
      exchangeRate: 9.0, // Default: 900 KRW / 100 JPY
      budgetJPY: {
        card1: 50000,
        card2: 50000,
        cash_bill: 30000,
        cash_coin: 0,
      },
      coins: {
        500: 0,
        100: 0,
        50: 0,
        10: 0,
        5: 0,
        1: 0,
      },
      expenses: [],

      setActiveTab: (tab) => set({ activeTab: tab }),
      setExchangeRate: (rate) => set({ exchangeRate: rate }),
      
      setBudget: (method, amount) => set((state) => ({
        budgetJPY: {
          ...state.budgetJPY,
          [method]: amount
        }
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [
          ...state.expenses,
          { ...expense, id: crypto.randomUUID() }
        ]
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      })),

      editExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map((e) => 
          e.id === id ? { ...e, ...updatedExpense } : e
        ),
      })),

      updateCoinCount: (coin, delta) => set((state) => {
        const newCount = Math.max(0, state.coins[coin] + delta);
        const newCoins = { ...state.coins, [coin]: newCount };
        
        // Auto-sync cash_coin budget based on coin total
        const newCashCoinTotal = Object.entries(newCoins).reduce((sum, [c, count]) => sum + (Number(c) * count), 0);
        
        return {
          coins: newCoins,
          budgetJPY: {
            ...state.budgetJPY,
            cash_coin: newCashCoinTotal
          }
        };
      })
    }),
    {
      name: 'japan-ledger-storage',
    }
  )
);
