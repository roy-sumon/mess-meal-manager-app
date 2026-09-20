import { useState, useEffect } from 'react';
import { X, Settings, ShoppingBag, Building2, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { useLanguage } from '../context/useLanguage';

const ExpenseConfigModal = ({ 
  isOpen, 
  onClose, 
  config, 
  onSaveConfig, 
  totalDeposit 
}) => {
  const { t } = useLanguage();
  const [messName, setMessName] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [useBazarCost, setUseBazarCost] = useState(false);
  const [customBazarCost, setCustomBazarCost] = useState('');

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
    if (config) {
      setMessName(config.messName || '');
      setMonthYear(config.monthYear || '');
      setUseBazarCost(!!config.useBazarCost);
      setCustomBazarCost(config.customBazarCost ? String(config.customBazarCost) : '');
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig({
      messName: messName.trim() || 'Mess Meal Manager',
      monthYear: monthYear.trim() || 'Current Month',
      useBazarCost,
      customBazarCost: useBazarCost ? parseFloat(customBazarCost) || 0 : 0,
    });
    onClose();
  };

  const parsedBazarCost = parseFloat(customBazarCost) || 0;
  const leftover = totalDeposit - parsedBazarCost;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-750 p-5 sm:p-6 shadow-2xl ring-1 ring-white/10"
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
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{t.configModalTitle}</h2>
            <p className="text-xs text-slate-400">{t.configModalSub}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Mess Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.labelMessName}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                placeholder={t.placeholderMessName}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Month / Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.labelMonthYear}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                placeholder={t.placeholderMonthYear}
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Mode Switch Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="pr-4">
                <span className="text-sm font-semibold text-white block">{t.toggleBazarQuestion}</span>
                <span className="text-xs text-slate-400">
                  {t.toggleBazarSub}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={useBazarCost}
                  onChange={(e) => setUseBazarCost(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Custom Bazar Cost Input */}
            {useBazarCost && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {t.labelBazarCost}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={customBazarCost}
                    onChange={(e) => setCustomBazarCost(e.target.value)}
                    placeholder={t.placeholderBazarCost}
                    className="w-full rounded-xl bg-slate-800 border border-indigo-500/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Leftover Fund / Deficit calculation */}
                <div className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">{t.totalDepositsLabel} {formatCurrency(totalDeposit)}</span>
                  <span className={leftover >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                    {leftover >= 0 ? t.managerLeftover(formatCurrency(leftover)) : t.managerDeficit(formatCurrency(Math.abs(leftover)))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
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
              {t.btnSaveSettings}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ExpenseConfigModal;
