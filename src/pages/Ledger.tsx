import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { PaymentMethod } from '../store/useStore';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export const Ledger: React.FC = () => {
  const { expenses, deleteExpense, editExpense, exchangeRate } = useStore();
  const [filter, setFilter] = useState<PaymentMethod | 'all'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  // Edit State
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [editMethod, setEditMethod] = useState<PaymentMethod>('card1');
  const [editCategory, setEditCategory] = useState<string>('식비');

  const methodLabels: Record<PaymentMethod, string> = {
    card1: '트래블로그',
    card2: '트랩앤J',
    cash_bill: '지폐',
    cash_coin: '동전',
  };
  const categories: string[] = ['식비', '쇼핑', '교통', '관광', '숙박', '기타'];

  const handleOpenEdit = (exp: typeof expenses[0]) => {
    setEditTargetId(exp.id);
    setEditAmount(exp.amountJPY.toString());
    setEditMemo(exp.memo || '');
    setEditMethod(exp.method);
    setEditCategory(exp.category || '식비');
  };

  const handleSaveEdit = () => {
    if (!editTargetId || !editAmount || parseInt(editAmount) === 0) return;
    
    editExpense(editTargetId, {
      amountJPY: parseInt(editAmount),
      amountKRW: Math.round(parseInt(editAmount) * exchangeRate),
      method: editMethod,
      category: editCategory,
      memo: editMemo.trim() || undefined,
    });
    
    setEditTargetId(null);
  };

  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(exp => exp.method === filter);

  // Group by date (YYYY-MM-DD)
  const grouped = filteredExpenses.reduce((acc, exp) => {
    const d = format(new Date(exp.date), 'yyyy-MM-dd');
    if (!acc[d]) acc[d] = [];
    acc[d].push(exp);
    return acc;
  }, {} as Record<string, typeof expenses>);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col min-h-screen pb-[100px] bg-background-regular">
      <div className="px-5 pt-16 pb-4">
        <h1 className="text-display2 font-bold text-text-strong leading-tight tracking-tight">
          지출 내역
        </h1>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-2 px-4 py-3 overflow-x-auto no-scrollbar bg-background-regular/80 backdrop-blur-md sticky top-0 z-30">
        <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
          전체
        </Chip>
        {(Object.keys(methodLabels) as PaymentMethod[]).map(method => (
          <Chip 
            key={method} 
            selected={filter === method} 
            onClick={() => setFilter(method)}
          >
            {methodLabels[method]}
          </Chip>
        ))}
      </div>

      <div className="px-4 py-4 space-y-6">
        {sortedDates.length === 0 && (
          <div className="py-20 text-center text-body1 text-text-tertiary">
            지출 내역이 없습니다.
          </div>
        )}

        {sortedDates.map(date => {
          const dailyTotal = grouped[date].reduce((sum, exp) => sum + exp.amountJPY, 0);
          
          return (
          <div key={date} className="space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="text-title3 text-text-secondary">{format(new Date(date), 'MM월 dd일')}</h3>
              <span className="text-caption1 text-text-strong">총 {dailyTotal.toLocaleString()}엔 지출</span>
            </div>
            <Card className="p-0 overflow-hidden">
              {grouped[date].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((exp, i) => (
                <div 
                  key={exp.id} 
                  className={clsx("p-4 flex justify-between items-center active:bg-pressed-regular transition-colors cursor-pointer", i !== 0 && "border-t border-border-regular")}
                  onClick={() => handleOpenEdit(exp)}
                >
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-body2 text-text-strong font-medium truncate max-w-[160px]">
                      {exp.category ? `[${exp.category}] ` : ''}
                      {exp.memo || '지출'}
                    </span>
                    <div className="flex items-center text-caption3 text-text-tertiary space-x-1">
                      <span>{format(new Date(exp.date), 'HH:mm')}</span>
                      <span>·</span>
                      <span>{methodLabels[exp.method]}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end">
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-title2 text-text-strong">-{exp.amountJPY.toLocaleString()}</span>
                        <span className="text-body3 text-text-strong">엔</span>
                      </div>
                      <div className="flex items-baseline space-x-0.5 mt-0.5">
                        <span className="text-caption2 text-text-tertiary">-{exp.amountKRW.toLocaleString()}</span>
                        <span className="text-caption4 text-text-tertiary">원</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening edit sheet
                        setDeleteTargetId(exp.id);
                      }}
                      className="p-1.5 ml-1 text-text-disabled active:text-notification-red transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )})}
      </div>

      <Alert 
        isOpen={deleteTargetId !== null}
        title="지출 내역 삭제"
        description="정말 이 내역을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다."
        cancelText="취소"
        confirmText="삭제하기"
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteExpense(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
      />

      <BottomSheet
        isOpen={editTargetId !== null}
        onClose={() => setEditTargetId(null)}
        title="내역 수정"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-body2 text-text-secondary">결제 수단</label>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
              {(Object.keys(methodLabels) as PaymentMethod[]).map(method => (
                <Chip
                  key={method}
                  selected={editMethod === method}
                  onClick={() => setEditMethod(method)}
                >
                  {methodLabels[method]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-body2 text-text-secondary">카테고리</label>
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
              {categories.map(cat => (
                <Chip
                  key={cat}
                  selected={editCategory === cat}
                  onClick={() => setEditCategory(cat)}
                >
                  {cat}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-body2 text-text-secondary">금액 (엔)</label>
            <input 
              type="number" 
              inputMode="numeric"
              placeholder="0"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-full bg-white border border-border-regular rounded-[12px] px-4 py-3 text-heading4 text-text-strong focus:outline-none focus:border-primary-regular transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-body2 text-text-secondary">메모 (선택)</label>
            <input 
              type="text"
              placeholder="어디에 쓰셨나요?"
              value={editMemo}
              onChange={(e) => setEditMemo(e.target.value)}
              className="w-full bg-white border border-border-regular rounded-[12px] px-4 py-3 text-body1 text-text-strong focus:outline-none focus:border-primary-regular transition-colors"
            />
          </div>

          <div className="pt-2 pb-8">
            <Button 
              onClick={handleSaveEdit}
              disabled={!editAmount || parseInt(editAmount) === 0}
            >
              수정 완료
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
