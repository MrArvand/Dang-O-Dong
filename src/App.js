import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CalculatorIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
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
  const [githubStars, setGithubStars] = useState(null);

  // Fetch GitHub star count
  const fetchGithubStars = async () => {
    try {
      const response = await fetch('https://api.github.com/repos/MrArvand/Dang-O-Dong');
      if (response.ok) {
        const data = await response.json();
        setGithubStars(data.stargazers_count);
      }
    } catch (error) {
      console.error('Error fetching GitHub stars:', error);
    }
  };

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
    fetchGithubStars();
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
            <div className="flex items-center justify-center gap-4 mt-2">
              <p className="text-xs">
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
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/MrArvand/Dang-O-Dong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  title="View on GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                {githubStars !== null && (
                  <a
                    href="https://github.com/MrArvand/Dang-O-Dong/stargazers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title={`${githubStars} stars on GitHub`}
                  >
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    <span>{githubStars}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
