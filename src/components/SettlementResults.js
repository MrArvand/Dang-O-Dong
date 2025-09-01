import React from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatCurrencyWithWords } from '../utils/persianUtils';
import { calculateMemberTotals, calculateSettlements, calculateTotalPaid, calculateTotalOwed, calculateNetBalance } from '../utils/calculationUtils';

const SettlementResults = ({ expenses, members }) => {
  if (expenses.length === 0) {
    return (
      <div className="card p-4 sm:p-6 text-center">
        <CurrencyDollarIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          هنوز هیچ هزینه‌ای ثبت نشده است
        </p>
      </div>
    );
  }

  const memberTotals = calculateMemberTotals(expenses);
  const settlements = calculateSettlements(memberTotals);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'نامشخص';
  };

  // Use the new helper functions for better consistency
  const calculateTotalSpending = (memberId) => calculateTotalPaid(memberId, expenses);
  const calculateTotalParticipation = (memberId) => calculateTotalOwed(memberId, expenses);

  const creditors = Object.entries(memberTotals)
    .filter(([_, balance]) => balance > 0)
    .sort(([_, a], [__, b]) => b - a);

  const debtors = Object.entries(memberTotals)
    .filter(([_, balance]) => balance < 0)
    .sort(([_, a], [__, b]) => a - b);

  const balanced = Object.entries(memberTotals)
    .filter(([_, balance]) => balance === 0);

  // Debug logging
  console.log('Settlement Debug:', {
    memberTotals,
    settlements: settlements.length,
    creditors: creditors.length,
    debtors: debtors.length,
    expenses: expenses.length
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Card */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          خلاصه کلی
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              کل هزینه‌ها
            </div>
          </div>
          {members.map((member) => {
            const totalSpent = calculateTotalSpending(member.id);
            return (
              <div key={member.id} className="text-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalSpent)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {member.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bills Table */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          لیست فاکتورها
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white">توضیحات</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white">مبلغ</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white">پرداخت‌کننده</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white hidden sm:table-cell">شرکت‌کنندگان</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 dark:text-white">
                    {expense.description}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 dark:text-white font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 dark:text-white">
                    {getMemberName(expense.payer)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                    {expense.participants.map(id => getMemberName(id)).join('، ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Instructions - Always show when there are debts/credits */}
      {(creditors.length > 0 || debtors.length > 0) && (
        <div className="card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            دستورالعمل تسویه حساب
          </h3>

          {settlements.length > 0 ? (
            <>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                برای تسویه کامل حساب‌ها، مبالغ زیر را پرداخت کنید:
              </p>
              <div className="space-y-3">
                {settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {getMemberName(settlement.from)}
                        </span>
                        <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                          {getMemberName(settlement.to)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600 dark:text-blue-400 text-base sm:text-lg">
                          {formatCurrency(settlement.amount)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <strong>{getMemberName(settlement.from)}</strong> باید مبلغ{' '}
                      <strong>{formatCurrency(settlement.amount)}</strong> را به{' '}
                      <strong>{getMemberName(settlement.to)}</strong> پرداخت کند.
                      <br />
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatCurrencyWithWords(settlement.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                وضعیت بدهی و طلب اعضا:
              </p>
              <div className="space-y-4">
                {creditors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 text-sm sm:text-base">بستانکاران:</h4>
                    <div className="space-y-2">
                      {creditors.map(([memberId, amount]) => (
                        <div key={memberId} className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="font-medium text-sm sm:text-base">{getMemberName(memberId)}</span>
                          <span className="text-green-600 dark:text-green-400 font-bold mr-2 text-sm sm:text-base">
                            +{formatCurrency(amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {debtors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2 text-sm sm:text-base">بدهکاران:</h4>
                    <div className="space-y-2">
                      {debtors.map(([memberId, amount]) => (
                        <div key={memberId} className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <span className="font-medium text-sm sm:text-base">{getMemberName(memberId)}</span>
                          <span className="text-red-600 dark:text-red-400 font-bold mr-2 text-sm sm:text-base">
                            -{formatCurrency(amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Balanced Accounts Message */}
      {creditors.length === 0 && debtors.length === 0 && (
        <div className="card p-4 sm:p-6 text-center">
          <CheckCircleIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-green-500 mb-4" />
          <p className="text-green-600 dark:text-green-400 font-medium text-sm sm:text-base">
            همه حساب‌ها متوازن هستند!
          </p>
        </div>
      )}
    </div>
  );
};

export default SettlementResults;
