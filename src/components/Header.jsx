
import { 
  UtensilsCrossed, 
  UserPlus, 
  Settings, 
  Share2, 
  Download, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

const Header = ({ 
  config, 
  onOpenAddMember, 
  onOpenSettings, 
  onOpenShare, 
  onOpenPdf, 
  onResetData, 
  onLoadDemo 
}) => {
  return (
    <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Mess Info */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                  {config.messName || 'Mess Meal Manager'}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {config.monthYear}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                <span>স্মার্ট মেস মিল ও হিসাব ব্যবস্থাপনা</span>
                <span className="text-slate-600">•</span>
                <button 
                  onClick={onOpenSettings}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  মেসের নাম বা মাস পরিবর্তন করুন
                </button>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Demo button */}
            <button
              onClick={onLoadDemo}
              title="ডেমো মেম্বার ডাটা লোড করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 hover:border-slate-600 transition-all active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">ডেমো ডাটা</span>
            </button>

            {/* Reset button */}
            <button
              onClick={onResetData}
              title="সব ডাটা রিসেট করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-900/40 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিসেট</span>
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              title="বাজার খরচ ও সেটিংস"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 hover:border-slate-600 transition-all active:scale-95"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span>বাজার খরচ</span>
            </button>

            {/* WhatsApp Share button */}
            <button
              onClick={onOpenShare}
              title="মেস গ্রুপে শেয়ার করার টেক্সট কপি করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>শেয়ার</span>
            </button>

            {/* PDF Export button */}
            <button
              onClick={onOpenPdf}
              title="PDF রিপোর্ট ডাউনলোড করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-slate-600 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">PDF রিপোর্ট</span>
            </button>

            {/* Primary Add Member Button */}
            <button
              onClick={onOpenAddMember}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>সদস্য যোগ করুন</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
