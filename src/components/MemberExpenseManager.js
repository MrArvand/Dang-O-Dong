import React, { useState } from 'react';
import {
    PlusIcon,
    TrashIcon,
    UserIcon,
    CurrencyDollarIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatInputValue, unformatPersianNumber } from '../utils/persianUtils';
import { getMemberBalance, getMemberStatus } from '../utils/calculationUtils';

const MemberExpenseManager = ({
    members,
    expenses,
    onAddMember,
    onDeleteMember,
    onAddExpense,
    onDeleteExpense,
    memberTotals,
    isSharedMode = false
}) => {
    const [newMemberName, setNewMemberName] = useState('');
    const [expandedMembers, setExpandedMembers] = useState(new Set());
    const [expenseForms, setExpenseForms] = useState({});

    const handleAddMember = (e) => {
        e.preventDefault();
        if (newMemberName.trim()) {
            onAddMember({
                id: Date.now().toString(),
                name: newMemberName.trim()
            });
            setNewMemberName('');
        }
    };

    const toggleMemberExpansion = (memberId) => {
        const newExpanded = new Set(expandedMembers);
        if (newExpanded.has(memberId)) {
            newExpanded.delete(memberId);
        } else {
            newExpanded.add(memberId);
        }
        setExpandedMembers(newExpanded);
    };

    const handleAddExpenseForMember = (memberId, expenseData) => {
        onAddExpense({
            id: Date.now().toString(),
            description: expenseData.description,
            amount: unformatPersianNumber(expenseData.amount),
            payer: memberId,
            participants: expenseData.participants,
            date: new Date().toISOString()
        });

        // Clear the form for this member
        setExpenseForms(prev => ({
            ...prev,
            [memberId]: { description: '', amount: '', participants: [] }
        }));
    };

    const handleAmountChange = (memberId, value) => {
        // Convert to Persian digits for display
        const formattedValue = formatInputValue(value);
        setExpenseForms(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                amount: formattedValue,
                description: prev[memberId]?.description || '',
                participants: prev[memberId]?.participants || []
            }
        }));
    };

    const handleDescriptionChange = (memberId, value) => {
        setExpenseForms(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                description: value,
                amount: prev[memberId]?.amount || '',
                participants: prev[memberId]?.participants || []
            }
        }));
    };

    const handleParticipantsChange = (memberId, participants) => {
        setExpenseForms(prev => ({
            ...prev,
            [memberId]: {
                ...prev[memberId],
                participants: participants,
                description: prev[memberId]?.description || '',
                amount: prev[memberId]?.amount || ''
            }
        }));
    };

    const getMemberExpenses = (memberId) => {
        return expenses.filter(expense =>
            expense.payer === memberId ||
            expense.participants.includes(memberId)
        );
    };

    const getMemberName = (memberId) => {
        const member = members.find(m => m.id === memberId);
        return member ? member.name : 'نامشخص';
    };

    const getParticipantNames = (participantIds) => {
        return participantIds.map(id => getMemberName(id)).join('، ');
    };

    if (members.length === 0) {
        return (
            <div className="space-y-6">
                {/* Add Member Form */}
                {!isSharedMode && (
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            افزودن عضو جدید
                        </h3>
                        <form onSubmit={handleAddMember} className="flex gap-3">
                            <input
                                type="text"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder="نام عضو را وارد کنید..."
                                className="input-field flex-1"
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary flex items-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                افزودن
                            </button>
                        </form>
                    </div>
                )}

                {/* Empty State */}
                <div className="card p-6 text-center">
                    <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {isSharedMode ? 'هیچ عضوی در این اشتراک وجود ندارد' : 'هنوز عضوی اضافه نشده است'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add Member Form */}
            {!isSharedMode && (
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        افزودن عضو جدید
                    </h3>
                    <form onSubmit={handleAddMember} className="flex gap-3">
                        <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="نام عضو را وارد کنید..."
                            className="input-field flex-1"
                            required
                        />
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2"
                        >
                            <PlusIcon className="w-5 h-5" />
                            افزودن
                        </button>
                    </form>
                </div>
            )}

            {/* Members List with Expenses */}
            <div className="space-y-4">
                {members.map((member) => {
                    const balance = getMemberBalance(member.id, memberTotals);
                    const status = getMemberStatus(balance);
                    const isExpanded = expandedMembers.has(member.id);
                    const memberExpenses = getMemberExpenses(member.id);
                    const memberForm = expenseForms[member.id] || { description: '', amount: '', participants: [] };

                    return (
                        <div key={member.id} className="card overflow-hidden">
                            {/* Member Header */}
                            <div
                                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => toggleMemberExpansion(member.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {member.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-sm px-2 py-1 rounded-full ${status === 'creditor'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : status === 'debtor'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {status === 'creditor' ? 'بستانکار' :
                                                        status === 'debtor' ? 'بدهکار' : 'متوازن'}
                                                </span>
                                                <span className={`text-sm font-medium ${status === 'creditor' ? 'text-green-600 dark:text-green-400' :
                                                    status === 'debtor' ? 'text-red-600 dark:text-red-400' :
                                                        'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {formatCurrency(Math.abs(balance))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {memberExpenses.length} هزینه
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                        )}
                                        {!isSharedMode && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteMember(member.id);
                                                }}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                aria-label="حذف عضو"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="border-t border-gray-200 dark:border-gray-700">
                                    {/* Add Expense Form */}
                                    {!isSharedMode && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                                            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                                افزودن فاکتور جدید برای {member.name}
                                            </h5>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const description = memberForm?.description?.trim() || '';
                                                const amount = memberForm?.amount || '';
                                                const participants = memberForm?.participants || [];

                                                if (description && amount && participants.length > 0) {
                                                    handleAddExpenseForMember(member.id, memberForm);
                                                }
                                            }} className="space-y-3">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={memberForm.description}
                                                        onChange={(e) => handleDescriptionChange(member.id, e.target.value)}
                                                        placeholder="توضیحات هزینه..."
                                                        className="input-field"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={memberForm.amount}
                                                        onChange={(e) => handleAmountChange(member.id, e.target.value)}
                                                        placeholder="مبلغ (تومان)"
                                                        className="input-field persian-number"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        شرکت‌کنندگان
                                                    </label>
                                                    <div className="flex gap-2 mb-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleParticipantsChange(member.id, members.map(m => m.id));
                                                            }}
                                                            className="btn-secondary text-sm"
                                                        >
                                                            انتخاب همه
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleParticipantsChange(member.id, []);
                                                            }}
                                                            className="btn-secondary text-sm"
                                                        >
                                                            حذف همه
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {members.map(otherMember => (
                                                            <label
                                                                key={otherMember.id}
                                                                className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={memberForm.participants.includes(otherMember.id)}
                                                                    onChange={(e) => {
                                                                        const newParticipants = e.target.checked
                                                                            ? [...memberForm.participants, otherMember.id]
                                                                            : memberForm.participants.filter(id => id !== otherMember.id);
                                                                        handleParticipantsChange(member.id, newParticipants);
                                                                    }}
                                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm text-gray-900 dark:text-white">
                                                                    {otherMember.name}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                                    disabled={!(memberForm?.description?.trim()) || !(memberForm?.amount) || (memberForm?.participants?.length || 0) === 0}
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                    افزودن فاکتور
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* Member's Expenses List */}
                                    {memberExpenses.length > 0 && (
                                        <div className="p-4">
                                            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                                هزینه‌های {member.name}
                                            </h5>
                                            <div className="space-y-3">
                                                {memberExpenses.map((expense) => {
                                                    const isPayer = expense.payer === member.id;
                                                    const perPersonAmount = Math.round((expense.amount / expense.participants.length) * 100) / 100;

                                                    return (
                                                        <div
                                                            key={expense.id}
                                                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <h6 className="font-medium text-gray-900 dark:text-white">
                                                                            {expense.description}
                                                                        </h6>
                                                                        <span className={`text-xs px-2 py-1 rounded-full ${isPayer
                                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                                            }`}>
                                                                            {isPayer ? 'پرداخت‌کننده' : 'شرکت‌کننده'}
                                                                        </span>
                                                                    </div>

                                                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <CurrencyDollarIcon className="w-4 h-4" />
                                                                            <span className="font-medium">
                                                                                {formatCurrency(expense.amount)}
                                                                            </span>
                                                                        </div>

                                                                        <div>
                                                                            شرکت‌کنندگان: {getParticipantNames(expense.participants)}
                                                                        </div>

                                                                        {!isPayer && (
                                                                            <div className="text-green-600 dark:text-green-400 font-medium">
                                                                                سهم شما: {formatCurrency(perPersonAmount)}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {!isSharedMode && (
                                                                    <button
                                                                        onClick={() => onDeleteExpense(expense.id)}
                                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                        aria-label="حذف هزینه"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MemberExpenseManager;
