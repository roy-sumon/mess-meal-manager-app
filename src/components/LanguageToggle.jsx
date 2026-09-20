import { Languages } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-slate-950/70 border border-slate-800 shadow-sm text-xs">
      <div className="pl-1.5 pr-1 text-slate-400">
        <Languages className="w-3.5 h-3.5 text-indigo-400" />
      </div>
      <button
        onClick={() => setLanguage('bn')}
        className={`px-2 py-1 rounded-lg font-medium transition-all ${
          language === 'bn'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="বাংলা ভাষা নির্বাচন করুন"
      >
        বাংলা
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-lg font-medium transition-all ${
          language === 'en'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;
