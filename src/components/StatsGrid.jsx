import { 
  Wallet, 
  Utensils, 
  TrendingUp, 
  ShoppingBag, 
  Users
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { useLanguage } from '../context/useLanguage';

const StatsGrid = ({ metrics, memberCount, useBazarCost }) => {
  const { t } = useLanguage();

  const avgMeals = memberCount > 0 ? (metrics.totalMeals / memberCount).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Deposit */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-750/70 p-5 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/90 group">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.totalDeposit}
          </span>
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {formatCurrency(metrics.totalDeposit)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.totalDepositSub(memberCount)}</span>
          </div>
        </div>
      </div>

      {/* 2. Total Meals */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-750/70 p-5 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/90 group">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 rounded-full bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.totalMeals}
          </span>
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/20">
            <Utensils className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {metrics.totalMeals} <span className="text-sm font-normal text-slate-400">{t.totalMealsUnit}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {t.avgMealsPerMember(avgMeals)}
          </div>
        </div>
      </div>

      {/* 3. Meal Rate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-750/70 p-5 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/90 group">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.mealRate}
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">
            {formatCurrency(metrics.mealRate)}
            <span className="text-xs font-medium text-slate-400 ml-1">{t.perMeal}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {metrics.totalMeals > 0 ? t.mealRateFormula : t.noMealsYet}
          </div>
        </div>
      </div>

      {/* 4. Total Cost / Bazar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-750/70 p-5 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/90 group">
        <div className="absolute top-0 right-0 -mt-3 -mr-3 w-24 h-24 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t.totalCost}
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {formatCurrency(metrics.totalCost)}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>{useBazarCost ? t.manualBazar : t.autoDepositCost}</span>
            {useBazarCost && (
              <span className={metrics.leftoverFund >= 0 ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
                {metrics.leftoverFund >= 0 ? `${t.leftoverFund}: ` : `${t.deficitFund}: `}
                {formatCurrency(Math.abs(metrics.leftoverFund))}
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StatsGrid;
