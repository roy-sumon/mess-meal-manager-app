import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';
import { useLanguage } from '../context/useLanguage';

const WhatsAppShareModal = ({ 
  isOpen, 
  onClose, 
  config, 
  metrics, 
  members = [] 
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build the text representation based on active language
  const generateSummaryText = () => {
    let text = `📋 *${config.messName || 'Mess Meal Manager'}* - ${t.shareSheetTitle}\n`;
    text += `🗓️ *${t.shareMonth}:* ${config.monthYear}\n`;
    text += `───────────────────────\n`;
    text += `💰 *${t.shareDeposit}:* ${formatCurrency(metrics.totalDeposit)}\n`;
    text += `🛒 *${t.shareCost}:* ${formatCurrency(metrics.totalCost)}\n`;
    text += `🍽️ *${t.shareMeals}:* ${metrics.totalMeals} ${t.totalMealsUnit}\n`;
    text += `⚡ *${t.shareMealRate}:* ${formatCurrency(metrics.mealRate)} ${t.perMeal}\n`;
    if (config.useBazarCost && metrics.leftoverFund !== 0) {
      text += `💼 *${t.shareLeftover}:* ${formatCurrency(metrics.leftoverFund)}\n`;
    }
    text += `───────────────────────\n`;
    text += `👥 *${t.shareMembersBalance}*\n\n`;

    members.forEach((m, idx) => {
      const statusIcon = m.status === 'refund' ? t.shareRefundIcon : m.status === 'due' ? t.shareDueIcon : t.shareSettledIcon;
      const balanceText = m.status === 'due' 
        ? formatCurrency(Math.abs(m.balance)) 
        : formatCurrency(m.balance);

      text += `${idx + 1}. *${m.name}*\n`;
      text += `   • ${t.colTotalMeals}: ${m.totalMeals} | ${t.shareDeposit}: ${formatCurrency(m.depositBalance)}\n`;
      text += `   • ${t.colIndividualCost}: ${formatCurrency(m.individualCost)}\n`;
      text += `   • ${statusIcon} ${balanceText}\n\n`;
    });

    text += `───────────────────────\n`;
    text += t.shareFooter;
    return text;
  };

  const summaryText = generateSummaryText();

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        throw new Error('Clipboard API not supported');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Robust Fallback
      try {
        const textArea = document.createElement('textarea');
        textArea.value = summaryText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
    }
  };

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
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{t.shareModalTitle}</h2>
            <p className="text-xs text-slate-400">{t.shareModalSub}</p>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="relative">
          <pre className="w-full h-56 sm:h-64 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-mono overflow-y-auto whitespace-pre-wrap selection:bg-emerald-500 selection:text-white">
            {summaryText}
          </pre>
        </div>

        {/* Action Bar */}
        <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.shareHelperText}</span>
          </span>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-lg transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-600 shadow-emerald-600/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/20'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>{t.btnCopied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.btnCopy}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppShareModal;
