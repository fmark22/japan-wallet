import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { PaymentMethod } from '../store/useStore';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

import { format } from 'date-fns';

export const Settings: React.FC = () => {
  const { expenses, exchangeRate, setExchangeRate, budgetJPY, setBudget } = useStore();
  
  const [localRate, setLocalRate] = useState((exchangeRate * 100).toString());
  const [localBudget, setLocalBudget] = useState(
    Object.entries(budgetJPY).reduce((acc, [k, v]) => ({ ...acc, [k]: v.toString() }), {} as Record<string, string>)
  );

  const methodLabels: Record<PaymentMethod, string> = {
    card1: '트래블로그 예산 (엔)',
    card2: '트랩앤J 예산 (엔)',
    cash_bill: '지폐 예산 (엔)',
    cash_coin: '동전 예산 (엔)',
  };

  const handleSaveRate = (val: string) => {
    const ratePer100 = parseFloat(val);
    if (!isNaN(ratePer100) && ratePer100 > 0) {
      setExchangeRate(ratePer100 / 100);
    }
  };

  const handleSaveBudget = (method: PaymentMethod, val: string) => {
    const budget = parseInt(val || '0', 10);
    if (!isNaN(budget) && budget >= 0) {
      setBudget(method, budget);
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('내보낼 지출 내역이 없습니다.');
      return;
    }

    const header = ['날짜', '시간', '결제수단', '카테고리', '메모', '엔화(JPY)', '원화(KRW)'];
    const rows = expenses.map(exp => {
      const dateObj = new Date(exp.date);
      const dateStr = format(dateObj, 'yyyy-MM-dd');
      const timeStr = format(dateObj, 'HH:mm:ss');
      const methodLabel = methodLabels[exp.method];
      return [
        dateStr,
        timeStr,
        methodLabel,
        exp.category || '',
        exp.memo || '',
        exp.amountJPY,
        exp.amountKRW
      ].map(v => `"${v}"`).join(',');
    });

    const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `japan_ledger_export_${format(new Date(), 'yyyyMMdd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen pb-[100px] bg-background-regular">
      <div className="px-5 pt-16 pb-4">
        <h1 className="text-display2 font-bold text-text-strong leading-tight tracking-tight">
          설정
        </h1>
      </div>
      
      <div className="px-4 py-2 space-y-6">
        <section className="space-y-3">
          <h2 className="text-title2 text-text-strong">환율 설정</h2>
          <Card className="flex flex-col space-y-2">
            <label className="text-body3 text-text-secondary">100엔 당 원화 금액</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                inputMode="numeric"
                value={localRate}
                onChange={(e) => setLocalRate(e.target.value)}
                onBlur={(e) => handleSaveRate(e.target.value)}
                className="w-full bg-background-regular h-14 pl-4 pr-10 rounded-[16px] text-title1 text-text-strong text-right outline-none focus:ring-2 focus:ring-primary-regular transition-all"
              />
              <span className="absolute right-4 text-body1 text-text-tertiary">원</span>
            </div>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-title2 text-text-strong">예산 설정</h2>
          <Card className="flex flex-col space-y-5">
            {(Object.keys(methodLabels) as PaymentMethod[]).map((method) => (
              <div key={method} className="flex flex-col space-y-2">
                <label className="text-body3 text-text-secondary">{methodLabels[method].replace(' 예산 (엔)', '')}</label>
                <div className="relative flex items-center">
                  <input 
                    type="number"
                    inputMode="numeric"
                    value={localBudget[method]}
                    onChange={(e) => setLocalBudget(prev => ({ ...prev, [method]: e.target.value }))}
                    onBlur={(e) => handleSaveBudget(method, e.target.value)}
                    className="w-full bg-background-regular h-14 pl-4 pr-10 rounded-[16px] text-title1 text-text-strong text-right outline-none focus:ring-2 focus:ring-primary-regular transition-all"
                  />
                  <span className="absolute right-4 text-body1 text-text-tertiary">엔</span>
                </div>
              </div>
            ))}
          </Card>
        </section>

        <section className="space-y-3 pt-6 border-t border-border-regular">
          <h2 className="text-title2 text-text-strong">데이터 관리</h2>
          <Card className="flex flex-col space-y-2">
            <p className="text-body3 text-text-secondary">지금까지 기록한 모든 지출 내역을 CSV 파일로 다운로드합니다. 엑셀이나 구글 스프레드시트에서 열어 정산할 수 있습니다.</p>
            <Button variant="secondary" onClick={handleExportCSV}>
              지출 내역 CSV 다운로드
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
};
