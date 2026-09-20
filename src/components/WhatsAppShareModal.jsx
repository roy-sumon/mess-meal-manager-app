import { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculator';

const WhatsAppShareModal = ({ 
  isOpen, 
  onClose, 
  config, 
  metrics, 
  members = [] 
}) => {
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

  // Build the text representation
  const generateSummaryText = () => {
    let text = `📋 *${config.messName || 'Mess Meal Manager'}* - হিসাব বিবরণী\n`;
    text += `🗓️ *মাস:* ${config.monthYear}\n`;
    text += `───────────────────────\n`;
    text += `💰 *মোট জমা:* ${formatCurrency(metrics.totalDeposit)}\n`;
    text += `🛒 *মোট খরচ:* ${formatCurrency(metrics.totalCost)}\n`;
    text += `🍽️ *মোট মিল:* ${metrics.totalMeals} টি\n`;
    text += `⚡ *মিল রেট:* ${formatCurrency(metrics.mealRate)} / মিল\n`;
    if (config.useBazarCost && metrics.leftoverFund !== 0) {
      text += `💼 *মেস ফান্ড উদ্বৃত্ত:* ${formatCurrency(metrics.leftoverFund)}\n`;
    }
    text += `───────────────────────\n`;
    text += `👥 *সদস্যদের চূড়ান্ত ব্যালান্স:*\n\n`;

    members.forEach((m, idx) => {
      const statusIcon = m.status === 'refund' ? '🟢 ফেরত পাবে:' : m.status === 'due' ? '🔴 বকেয়া (দিতে হবে):' : '⚪ পরিশোধিত:';
      const balanceText = m.status === 'due' 
        ? formatCurrency(Math.abs(m.balance)) 
        : formatCurrency(m.balance);

      text += `${idx + 1}. *${m.name}*\n`;
      text += `   • মিল: ${m.totalMeals} টি | জমা: ${formatCurrency(m.depositBalance)}\n`;
      text += `   • মিল খরচ: ${formatCurrency(m.individualCost)}\n`;
      text += `   • ${statusIcon} ${balanceText}\n\n`;
    });

    text += `───────────────────────\n`;
    text += `Generated with Mess Meal Manager App 🚀`;
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
          title="বন্ধ করুন (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4 pr-8">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">হোয়াটসঅ্যাপ / মেসেঞ্জার সামারি</h2>
            <p className="text-xs text-slate-400">মেস গ্রুপে এক ক্লিকে শেয়ার করার উপযোগী ফরম্যাটেড টেক্সট</p>
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
            <span>কপি করে সরাসরি মেসেঞ্জারে পেস্ট করুন</span>
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
                <span>কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>কপি করুন (Copy)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppShareModal;
