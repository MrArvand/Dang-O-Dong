// Calculate total expenses for each member
export const calculateMemberTotals = (expenses) => {
  const memberTotals = {};

  expenses.forEach(expense => {
    const { payer, amount, participants } = expense;
    const perPersonAmount = Math.floor(amount / participants.length);

    // The payer paid the full amount upfront
    memberTotals[payer] = (memberTotals[payer] || 0) + amount;

    // Each participant owes their share
    participants.forEach(participant => {
      memberTotals[participant] = (memberTotals[participant] || 0) - perPersonAmount;
    });
  });

  return memberTotals;
};

// Calculate optimal settlements
export const calculateSettlements = (memberTotals) => {
  const creditors = [];
  const debtors = [];

  // Separate creditors and debtors
  Object.entries(memberTotals).forEach(([member, balance]) => {
    if (balance > 0) { // Consider only positive amounts
      creditors.push({ member, amount: balance });
    } else if (balance < 0) { // Consider only negative amounts
      debtors.push({ member, amount: Math.abs(balance) });
    }
  });

  // Sort by amount (highest first)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];

  // Calculate optimal payments
  for (const debtor of debtors) {
    let remainingDebt = debtor.amount;

    for (const creditor of creditors) {
      if (remainingDebt <= 0 || creditor.amount <= 0) break;

      const paymentAmount = Math.min(remainingDebt, creditor.amount);

      settlements.push({
        from: debtor.member,
        to: creditor.member,
        amount: paymentAmount
      });

      remainingDebt = remainingDebt - paymentAmount;
      creditor.amount = creditor.amount - paymentAmount;
    }
  }

  return settlements;
};

// Get member balance
export const getMemberBalance = (memberId, memberTotals) => {
  return memberTotals[memberId] || 0;
};

// Check if member is creditor or debtor
export const getMemberStatus = (balance) => {
  if (balance > 0) return 'creditor';
  if (balance < 0) return 'debtor';
  return 'balanced';
};

// Calculate total amount paid by a member
export const calculateTotalPaid = (memberId, expenses) => {
  return expenses
    .filter(expense => expense.payer === memberId)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

// Calculate total amount a member owes (their share in all expenses they participated in)
export const calculateTotalOwed = (memberId, expenses) => {
  return expenses
    .filter(expense => expense.participants.includes(memberId))
    .reduce((sum, expense) => {
      const perPersonAmount = Math.floor(expense.amount / expense.participants.length);
      return sum + perPersonAmount;
    }, 0);
};

// Calculate net balance for a member (paid - owed)
export const calculateNetBalance = (memberId, expenses) => {
  const totalPaid = calculateTotalPaid(memberId, expenses);
  const totalOwed = calculateTotalOwed(memberId, expenses);
  return totalPaid - totalOwed;
};

// Validate that all calculations are correct (sum of all balances should be 0)
export const validateCalculations = (expenses, memberTotals) => {
  const totalPaid = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalOwed = expenses.reduce((sum, expense) => {
    const perPersonAmount = Math.floor(expense.amount / expense.participants.length);
    return sum + (perPersonAmount * expense.participants.length);
  }, 0);

  const sumOfBalances = Object.values(memberTotals).reduce((sum, balance) => sum + balance, 0);

  return {
    isValid: sumOfBalances === 0,
    totalPaid,
    totalOwed,
    sumOfBalances,
    difference: Math.abs(totalPaid - totalOwed)
  };
};

// Test function to verify calculation logic
export const testCalculation = () => {
  const testExpenses = [
    {
      id: '1',
      description: 'شام',
      amount: 100000,
      payer: 'user1',
      participants: ['user1', 'user2', 'user3'],
      date: new Date().toISOString()
    },
    {
      id: '2',
      description: 'تاکسی',
      amount: 50000,
      payer: 'user2',
      participants: ['user1', 'user2'],
      date: new Date().toISOString()
    }
  ];

  const memberTotals = calculateMemberTotals(testExpenses);
  console.log('Test Calculation Results:');
  console.log('Member Totals:', memberTotals);
  console.log('Validation:', validateCalculations(testExpenses, memberTotals));

  return memberTotals;
};
