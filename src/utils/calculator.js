/**
 * Mess meal calculations utility
 */

export const calculateMessMetrics = (members = [], customBazarCost = 0, useBazarCost = false) => {
  const rawTotalDeposit = members.reduce((sum, m) => sum + (Number(m.depositBalance) || 0), 0);
  const totalDeposit = Math.round(rawTotalDeposit * 100) / 100;

  const rawTotalMeals = members.reduce((sum, m) => sum + (Number(m.totalMeals) || 0), 0);
  const totalMeals = Math.round(rawTotalMeals * 100) / 100;

  // If user sets a custom Bazar/Expense amount, use that for meal cost calculation;
  // otherwise, default to total deposits.
  const totalCost = useBazarCost && Number(customBazarCost) >= 0 ? Number(customBazarCost) : totalDeposit;

  const mealRate = totalMeals > 0 ? Math.round((totalCost / totalMeals) * 100) / 100 : 0;
  const leftoverFund = Math.round((totalDeposit - totalCost) * 100) / 100;

  const membersWithCalculations = members.map((member) => {
    const meals = Number(member.totalMeals) || 0;
    const deposit = Number(member.depositBalance) || 0;
    const individualCost = Math.round(meals * mealRate * 100) / 100;
    const balance = Math.round((deposit - individualCost) * 100) / 100;

    let status = 'settled';
    if (balance > 0.01) {
      status = 'refund'; // Mess manager will refund to member
    } else if (balance < -0.01) {
      status = 'due'; // Member owes mess manager
    }

    return {
      ...member,
      id: member.id || String(Date.now() + Math.random()),
      depositBalance: deposit,
      totalMeals: meals,
      individualCost,
      balance,
      status,
    };
  });

  const totalRefunds = Math.round(
    membersWithCalculations
      .filter((m) => m.status === 'refund')
      .reduce((sum, m) => sum + m.balance, 0) * 100
  ) / 100;

  const totalDues = Math.round(
    membersWithCalculations
      .filter((m) => m.status === 'due')
      .reduce((sum, m) => sum + Math.abs(m.balance), 0) * 100
  ) / 100;

  return {
    totalDeposit,
    totalMeals,
    totalCost,
    mealRate,
    leftoverFund,
    totalRefunds,
    totalDues,
    members: membersWithCalculations,
  };
};

export const formatCurrency = (amount = 0) => {
  const val = Number(amount) || 0;
  return `৳${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
