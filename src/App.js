import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CalculatorIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import ThemeToggle from './components/ThemeToggle';
import MemberExpenseManager from './components/MemberExpenseManager';
import SettlementResults from './components/SettlementResults';
import ShareButton from './components/ShareButton';
import ShareIndicator from './components/ShareIndicator';
import Preloader from './components/Preloader';
import { calculateMemberTotals } from './utils/calculationUtils';
import { extractShareData, hasShareData, clearShareData } from './utils/shareUtils';

function App() {
  const [isDark, setIsDark] = useState(true); // Set dark theme as default
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage or URL on mount
  useEffect(() => {
    const loadData = async () => {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if there's share data in URL first
      if (hasShareData()) {
        const shareData = extractShareData();
        if (shareData) {
          setMembers(shareData.members);
          setExpenses(shareData.expenses);
          setIsSharedMode(true);
          setIsLoading(false);
          return; // Don't load from localStorage if we have share data
        }
      }

      // Load from localStorage if no share data
      const savedMembers = localStorage.getItem('dang-o-dong-members');
      const savedExpenses = localStorage.getItem('dang-o-dong-expenses');
      const savedTheme = localStorage.getItem('dang-o-dong-theme');

      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      }
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes (only in non-shared mode)
  useEffect(() => {
    if (!isSharedMode) {
      localStorage.setItem('dang-o-dong-members', JSON.stringify(members));
    }
  }, [members, isSharedMode]);

  useEffect(() => {
    if (!isSharedMode) {
      localStorage.setItem('dang-o-dong-expenses', JSON.stringify(expenses));
    }
  }, [expenses, isSharedMode]);

  useEffect(() => {
    localStorage.setItem('dang-o-dong-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleAddMember = (member) => {
    setMembers(prev => [...prev, member]);
  };

  const handleDeleteMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
    setExpenses(prev => prev.filter(e => e.payer !== memberId && !e.participants.includes(memberId)));
  };

  const handleAddExpense = (expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const handleResetAll = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام اعضا و هزینه‌ها را حذف کنید؟')) {
      setMembers([]);
      setExpenses([]);
      if (!isSharedMode) {
        localStorage.removeItem('dang-o-dong-members');
        localStorage.removeItem('dang-o-dong-expenses');
      }
    }
  };

  const handleClearShare = () => {
    if (window.confirm('آیا می‌خواهید حالت اشتراکی را پاک کرده و شروع جدید کنید؟')) {
      setMembers([]);
      setExpenses([]);
      setIsSharedMode(false);
      clearShareData();
    }
  };

  const memberTotals = calculateMemberTotals(expenses);

  const tabs = [
    { id: 'members', name: 'اعضا و هزینه‌ها', icon: UserGroupIcon },
    { id: 'settlement', name: 'تسویه حساب', icon: CalculatorIcon }
  ];

  // Show preloader while loading
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  دَنگ و دونگ
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  نرم‌افزار تقسیم هزینه‌ها
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </div>
        </div>
      </header>

      {/* Share Indicator */}
      {isSharedMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <ShareIndicator onClearShare={handleClearShare} />
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 sm:space-x-8 space-x-reverse">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 sm:gap-2 py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.id === 'members' ? 'اعضا' : 'تسویه'}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <ShareButton members={members} expenses={expenses} />
              <button
                onClick={handleResetAll}
                className="btn-reset flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                title="حذف تمام اعضا و هزینه‌ها"
              >
                <ArrowPathIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">بازنشانی</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'members' && (
          <MemberExpenseManager
            members={members}
            expenses={expenses}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            memberTotals={memberTotals}
            isSharedMode={isSharedMode}
          />
        )}

        {activeTab === 'settlement' && (
          <SettlementResults expenses={expenses} members={members} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">دَنگ و دونگ - نرم‌افزار تقسیم هزینه‌ها</p>
            <p className="text-xs mt-1">
              Made with ❤️ by{' '}
              <a
                href="https://arvand.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Arvand
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
