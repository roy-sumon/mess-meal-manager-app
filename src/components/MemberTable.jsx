import { useState, useMemo } from 'react';
import { 
  Search, 
  Edit3, 
  Trash2, 
  UserCheck, 
  ArrowUpDown, 
  UserX, 
  Plus,
  X
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { useLanguage } from '../context/useLanguage';

const MemberTable = ({ 
  members = [], 
  metrics, 
  onEditMember, 
  onDeleteMember, 
  onOpenAddMember 
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'refund' | 'due'
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc' | 'meals-desc' | 'deposit-desc' | 'balance-desc'

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let list = members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterStatus === 'refund') return member.status === 'refund';
      if (filterStatus === 'due') return member.status === 'due';
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'meals-desc') return b.totalMeals - a.totalMeals;
      if (sortBy === 'deposit-desc') return b.depositBalance - a.depositBalance;
      if (sortBy === 'balance-desc') return b.balance - a.balance;
      return 0;
    });

    return list;
  }, [members, searchQuery, filterStatus, sortBy]);

  const refundCount = members.filter((m) => m.status === 'refund').length;
  const dueCount = members.filter((m) => m.status === 'due').length;

  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Top Bar: Search, Filters, and Sorting */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs font-medium self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.allMembers(members.length)}
          </button>
          <button
            onClick={() => setFilterStatus('refund')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterStatus === 'refund'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            {t.refundMembers(refundCount)}
          </button>
          <button
            onClick={() => setFilterStatus('due')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              filterStatus === 'due'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            {t.dueMembers(dueCount)}
          </button>
        </div>

        {/* Right: Search & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950/60 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="meals-desc">{t.sortMealsDesc}</option>
              <option value="deposit-desc">{t.sortDepositDesc}</option>
              <option value="balance-desc">{t.sortBalanceDesc}</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      {filteredMembers.length === 0 ? (
        <div className="py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-500">
            {members.length === 0 ? <UserCheck className="w-8 h-8" /> : <UserX className="w-8 h-8" />}
          </div>
          <h3 className="text-base font-semibold text-slate-200">
            {members.length === 0 ? t.noMembersTitle : t.noMembersFoundTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            {members.length === 0 ? t.noMembersSub : t.noMembersFoundSub}
          </p>
          {members.length === 0 ? (
            <button
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addFirstMember}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95 border border-slate-700"
            >
              <span>{t.resetFilters}</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">{t.colMemberName}</th>
                  <th className="py-3.5 px-4 text-center">{t.colTotalMeals}</th>
                  <th className="py-3.5 px-4 text-right">{t.colDeposit}</th>
                  <th className="py-3.5 px-4 text-right">{t.colIndividualCost}</th>
                  <th className="py-3.5 px-4 text-center">{t.colStatus}</th>
                  <th className="py-3.5 px-5 text-right">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((member) => {
                  const initials = member.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const ratePerMeal = member.totalMeals > 0 ? (member.individualCost / member.totalMeals).toFixed(1) : 0;

                  return (
                    <tr 
                      key={member.id} 
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Name & Initials */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-tr from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                            {initials || 'M'}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-semibold text-white block truncate" title={member.name}>
                              {member.name}
                            </span>
                            <span className="text-xs text-slate-500">
                              {t.avgPerMealLabel(ratePerMeal)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Meals */}
                      <td className="py-3 px-4 text-center font-medium text-slate-200">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700/50">
                          {member.totalMeals}
                        </span>
                      </td>

                      {/* Deposit */}
                      <td className="py-3 px-4 text-right font-medium text-slate-200 whitespace-nowrap">
                        {formatCurrency(member.depositBalance)}
                      </td>

                      {/* Individual Cost */}
                      <td className="py-3 px-4 text-right font-medium text-slate-300 whitespace-nowrap">
                        {formatCurrency(member.individualCost)}
                      </td>

                      {/* Balance & Status Badge */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {member.status === 'refund' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                            {t.statusRefund(formatCurrency(member.balance))}
                          </span>
                        )}
                        {member.status === 'due' && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                            {t.statusDue(formatCurrency(Math.abs(member.balance)))}
                          </span>
                        )}
                        {member.status === 'settled' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            {t.statusSettled}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditMember(member)}
                            title={t.editTooltip}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteMember(member.id, member.name)}
                            title={t.deleteTooltip}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer with Summary */}
              <tfoot className="bg-slate-950/60 font-semibold text-slate-200 border-t-2 border-slate-800 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-5">{t.totalSummaryRow(filteredMembers.length)}</td>
                  <td className="py-3.5 px-4 text-center text-purple-400">
                    {Math.round(filteredMembers.reduce((sum, m) => sum + m.totalMeals, 0) * 100) / 100} {t.totalMealsUnit}
                  </td>
                  <td className="py-3.5 px-4 text-right text-indigo-400 whitespace-nowrap">
                    {formatCurrency(filteredMembers.reduce((sum, m) => sum + m.depositBalance, 0))}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-300 whitespace-nowrap">
                    {formatCurrency(filteredMembers.reduce((sum, m) => sum + m.individualCost, 0))}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs whitespace-nowrap">
                    <span className="text-emerald-400 mr-2">{t.totalRefunds}: {formatCurrency(metrics.totalRefunds)}</span>
                    <span className="text-rose-400">{t.totalDues}: {formatCurrency(metrics.totalDues)}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right text-slate-500">—</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Cards View (Visible only on mobile) */}
          <div className="md:hidden divide-y divide-slate-800/80 p-3 space-y-3">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3"
              >
                {/* Header: Name & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-indigo-900/60 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate" title={member.name}>{member.name}</h4>
                      <p className="text-xs text-slate-400">{member.totalMeals} {t.totalMealsUnit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => onEditMember(member)}
                      title={t.editTooltip}
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-300 bg-slate-800/90 active:scale-95 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMember(member.id, member.name)}
                      title={t.deleteTooltip}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-300 bg-slate-800/90 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">{t.colDeposit}:</span>
                    <span className="font-medium text-slate-200">{formatCurrency(member.depositBalance)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t.colIndividualCost}:</span>
                    <span className="font-medium text-slate-200">{formatCurrency(member.individualCost)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 flex-shrink-0">{t.netBalanceStatus}:</span>
                  <div className="text-right">
                    {member.status === 'refund' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        {t.statusRefund(formatCurrency(member.balance))}
                      </span>
                    )}
                    {member.status === 'due' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-400 border border-rose-800/60">
                        {t.statusDue(formatCurrency(Math.abs(member.balance)))}
                      </span>
                    )}
                    {member.status === 'settled' && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        {t.statusSettled}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default MemberTable;
