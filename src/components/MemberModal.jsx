import { useState, useEffect } from 'react';
import { X, User, Wallet, Utensils, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { useLanguage } from '../context/useLanguage';

const MemberModal = ({ isOpen, onClose, onSave, editingMember, currentMealRate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [depositBalance, setDepositBalance] = useState('');
  const [totalMeals, setTotalMeals] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name || '');
      setDepositBalance(editingMember.depositBalance !== undefined ? String(editingMember.depositBalance) : '');
      setTotalMeals(editingMember.totalMeals !== undefined ? String(editingMember.totalMeals) : '');
    } else {
      setName('');
      setDepositBalance('');
      setTotalMeals('');
    }
    setError('');
  }, [editingMember, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const parsedDeposit = parseFloat(depositBalance);
    const parsedMeals = parseFloat(totalMeals);

    if (!trimmedName) {
      setError(t.errNameRequired);
      return;
    }
    if (isNaN(parsedDeposit) || parsedDeposit < 0) {
      setError(t.errDepositInvalid);
      return;
    }
    if (isNaN(parsedMeals) || parsedMeals < 0) {
      setError(t.errMealsInvalid);
      return;
    }

    onSave({
      id: editingMember ? editingMember.id : undefined,
      name: trimmedName,
      depositBalance: parsedDeposit,
      totalMeals: parsedMeals,
    });

    onClose();
  };

  // Real-time preview
  const numMeals = parseFloat(totalMeals) || 0;
  const numDeposit = parseFloat(depositBalance) || 0;
  const estimatedCost = numMeals * (currentMealRate || 0);
  const estimatedBalance = numDeposit - estimatedCost;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-750 p-5 sm:p-6 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Esc"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {editingMember ? t.modalEditTitle : t.modalAddTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {editingMember ? t.modalEditSub : t.modalAddSub}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Member Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.labelName}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder={t.placeholderName}
                autoFocus
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Deposit Balance */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.labelDeposit}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="any"
                min="0"
                value={depositBalance}
                onChange={(e) => {
                  setDepositBalance(e.target.value);
                  setError('');
                }}
                placeholder={t.placeholderDeposit}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Total Meals */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.labelMeals}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Utensils className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="any"
                min="0"
                value={totalMeals}
                onChange={(e) => {
                  setTotalMeals(e.target.value);
                  setError('');
                }}
                placeholder={t.placeholderMeals}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Realtime Estimate Card */}
          {currentMealRate > 0 && numMeals > 0 && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400">{t.realtimeEstCost}</span>
                <p className="font-semibold text-white">{formatCurrency(estimatedCost)}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400">{t.realtimeEstBalance}</span>
                <p className={`font-bold ${estimatedBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {estimatedBalance >= 0 ? `+${formatCurrency(estimatedBalance)} ${t.refundTag}` : `${formatCurrency(estimatedBalance)} ${t.dueTag}`}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
            >
              {editingMember ? t.btnUpdate : t.btnSave}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default MemberModal;
