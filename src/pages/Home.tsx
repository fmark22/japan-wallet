import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { PaymentMethod } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BottomSheet } from '../components/BottomSheet';
import { CreditCard, Banknote, Coins } from 'lucide-react';
import { clsx } from 'clsx';

export const Home: React.FC = () => {
  const { budgetJPY, expenses, exchangeRate, addExpense } = useStore();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card1');
  const [selectedCategory, setSelectedCategory] = useState<string>('식비');
  const [memo, setMemo] = useState('');
  
  const categories: string[] = ['식비', '쇼핑', '교통', '관광', '숙박', '기타'];

  // Calculate totals
  const totalBudgetJPY = Object.values(budgetJPY).reduce((a, b) => a + b, 0);
  const totalSpentJPY = expenses.reduce((sum, exp) => sum + exp.amountJPY, 0);
  const remainingJPY = totalBudgetJPY - totalSpentJPY;
  const spentPercentage = totalBudgetJPY > 0 ? (totalSpentJPY / totalBudgetJPY) * 100 : 0;
  const isOverBudget = remainingJPY < 0;
  
  // Calculate remaining per method
  const spentByMethod = expenses.reduce((acc, exp) => {
    acc[exp.method] = (acc[exp.method] || 0) + exp.amountJPY;
    return acc;
  }, {} as Record<PaymentMethod, number>);

  const methodLabels: Record<PaymentMethod, string> = {
    card1: '트래블로그',
    card2: '트랩앤J',
    cash_bill: '지폐',
    cash_coin: '동전',
  };

  const handleAddExpense = () => {
    if (!amount || parseInt(amount) === 0) return;
    
    addExpense({
      amountJPY: parseInt(amount),
      amountKRW: Math.round(parseInt(amount) * exchangeRate),
      method: selectedMethod,
      category: selectedCategory,
      memo: memo.trim() || undefined,
      date: new Date().toISOString()
    });
    
    setAmount('');
    setMemo('');
    setIsAddSheetOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-[100px] bg-background-regular">
      <div className="px-5 pt-16 pb-4">
        <h1 className="text-display2 font-bold text-text-strong leading-tight tracking-tight">
          이번 여행에서<br />얼마나 썼을까요?
        </h1>
      </div>
      
      <div className="px-4 py-2 space-y-8">
        {/* Total Overview Card */}
        <div className={clsx(
          "rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden transition-colors",
          isOverBudget ? "bg-notification-red" : "bg-[#2563EB]"
        )}>
          {/* Decorative background shape */}
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-[0.08] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col space-y-5 relative z-10">
            <div className="flex flex-col space-y-1">
              <span className="text-body2 text-white/80 font-medium tracking-wide">남은 전체 예산</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-[40px] leading-tight tracking-tight font-bold">
                  {remainingJPY.toLocaleString()}
                </span>
                <span className="text-title1 font-medium text-white/90">엔</span>
              </div>
            </div>

            <div className="flex flex-col space-y-2.5 pt-1">
              <div className="flex justify-between items-end text-caption1 text-white/90 font-medium">
                <span>{spentPercentage.toFixed(0)}% 사용</span>
                <span className="text-white/70 font-normal">총 {totalBudgetJPY.toLocaleString()}엔</span>
              </div>
              <div className="h-2 w-full bg-black/15 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-white transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wallets */}
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(budgetJPY) as PaymentMethod[]).map((method) => {
            const methodBudget = budgetJPY[method];
            const methodSpent = spentByMethod[method] || 0;
            const methodRemain = methodBudget - methodSpent;
            const methodSpentRatio = methodBudget > 0 ? (methodSpent / methodBudget) * 100 : 0;
            const isOver = methodRemain < 0;
            
            return (
              <Card key={method} className="flex flex-col p-4 shadow-sm hover:shadow-tip transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-border-regular">
                    {method === 'card1' || method === 'card2' ? (
                      <CreditCard size={16} className="text-text-secondary" />
                    ) : method === 'cash_bill' ? (
                      <Banknote size={16} className="text-text-secondary" />
                    ) : (
                      <Coins size={16} className="text-text-secondary" />
                    )}
                  </div>
                  <span className="text-body3 text-text-secondary font-medium">{methodLabels[method]}</span>
                </div>
                
                <div className="flex flex-col mb-4">
                  <span className="text-caption3 text-text-tertiary mb-0.5">남은 금액</span>
                  <div className="flex items-baseline space-x-1">
                    <span className={clsx("text-title1 font-bold tracking-tight", isOver ? "text-notification-red" : "text-text-strong")}>
                      {methodRemain.toLocaleString()}
                    </span>
                    <span className="text-body3 text-text-strong font-medium">엔</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col space-y-1.5">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={clsx("h-full transition-all duration-500 rounded-full", isOver ? "bg-notification-red" : "bg-text-strong")}
                      style={{ width: `${Math.min(methodSpentRatio, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Primary Add Action */}
        <div className="pt-4">
          <Button 
            variant="primary"
            size="large" 
            fullWidth 
            onClick={() => setIsAddSheetOpen(true)}
            className="shadow-sm"
          >
            지출 내역 추가하기
          </Button>
        </div>
      </div>

      {/* Add Expense Bottom Sheet */}
      <BottomSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
      >
        <div className="p-5 flex flex-col h-full max-h-[85vh] overflow-y-auto no-scrollbar">
          <h2 className="text-heading3 text-text-strong mb-6 text-center">지출 추가</h2>

          {/* Amount Input */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center border-b-2 border-text-strong pb-2 w-2/3 max-w-[200px]">
              <input 
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-display2 font-bold text-text-strong text-center bg-transparent w-full outline-none placeholder-text-disabled"
                placeholder="0"
                autoFocus
              />
              <span className="text-title2 text-text-strong ml-1 flex-shrink-0">엔</span>
            </div>
            <p className="text-body3 text-text-tertiary mt-2">
              약 {amount ? Math.round(parseInt(amount) * exchangeRate).toLocaleString() : 0}원
            </p>
          </div>
          
          <div className="space-y-6 flex-1 mb-8">
            {/* Payment Method */}
            <div>
              <p className="text-caption2 text-text-secondary mb-2">결제 수단</p>
              <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                {(Object.keys(methodLabels) as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={clsx(
                      "px-4 py-2 rounded-full whitespace-nowrap text-title3 transition-colors",
                      selectedMethod === method
                        ? "bg-text-strong text-white"
                        : "bg-gray-100 text-text-secondary"
                    )}
                  >
                    {methodLabels[method]}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-caption2 text-text-secondary mb-2">카테고리</p>
              <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                      "px-4 py-2 rounded-full whitespace-nowrap text-title3 transition-colors",
                      selectedCategory === cat
                        ? "bg-text-strong text-white"
                        : "bg-gray-100 text-text-secondary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <p className="text-caption2 text-text-secondary mb-2">내용 (선택)</p>
              <input 
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="어디에 쓰셨나요?"
                className="w-full border-b border-divider-regular pb-2 outline-none text-body1 text-text-strong placeholder-text-disabled focus:border-text-strong transition-colors bg-transparent"
              />
            </div>
          </div>

          <div className="mt-auto mb-2">
            <Button 
              variant="primary" 
              size="large" 
              fullWidth 
              onClick={handleAddExpense}
              disabled={!amount || parseInt(amount) === 0}
            >
              추가하기
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
