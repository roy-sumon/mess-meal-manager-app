import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import MemberTable from './components/MemberTable';
import MemberModal from './components/MemberModal';
import ExpenseConfigModal from './components/ExpenseConfigModal';
import WhatsAppShareModal from './components/WhatsAppShareModal';
import PdfExportModal from './components/PdfExportModal';

import { calculateMessMetrics } from './utils/calculator';
import { 
  loadStoredMembers, 
  saveStoredMembers, 
  loadStoredConfig, 
  saveStoredConfig, 
  DEMO_MEMBERS,
  DEFAULT_CONFIG,
  clearAllData
} from './utils/storage';

import { CheckCircle2, Heart } from 'lucide-react';

function App() {
  const [members, setMembers] = useState(() => loadStoredMembers());
  const [config, setConfig] = useState(() => loadStoredConfig());

  // Modal controls
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Sync state with LocalStorage
  useEffect(() => {
    saveStoredMembers(members);
  }, [members]);

  useEffect(() => {
    saveStoredConfig(config);
  }, [config]);

  // Derived calculations
  const metrics = useMemo(() => {
    return calculateMessMetrics(members, config.customBazarCost, config.useBazarCost);
  }, [members, config.customBazarCost, config.useBazarCost]);

  // Member CRUD handlers
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (memberData) => {
    if (memberData.id) {
      // Edit existing
      setMembers((prev) =>
        prev.map((m) => (m.id === memberData.id ? { ...m, ...memberData } : m))
      );
      showToast(`সদস্য "${memberData.name}" এর তথ্য আপডেট করা হয়েছে!`);
    } else {
      // Add new
      const newMember = {
        ...memberData,
        id: String(Date.now()),
      };
      setMembers((prev) => [...prev, newMember]);
      showToast(`নতুন সদস্য "${memberData.name}" যোগ করা হয়েছে!`);
    }
  };

  const handleDeleteMember = (id, name) => {
    const confirmed = window.confirm(`আপনি কি নিশ্চিত যে "${name}" কে তালিকা থেকে মুছে ফেলতে চান?`);
    if (confirmed) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast(`"${name}" কে তালিকা থেকে মুছে ফেলা হয়েছে!`);
    }
  };

  const handleResetData = () => {
    const confirmed = window.confirm('সতর্কতা: আপনি কি মেসের সব মেম্বার ও ডাটা রিসেট করতে চান?');
    if (confirmed) {
      clearAllData();
      setMembers([]);
      setConfig(DEFAULT_CONFIG);
      showToast('সব ডাটা মুছে ফেলা হয়েছে!');
    }
  };

  const handleLoadDemo = () => {
    setMembers(DEMO_MEMBERS);
    setConfig(DEFAULT_CONFIG);
    showToast('ডেমো মেম্বার ডাটা সফলভাবে লোড হয়েছে!');
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    showToast('মেস সেটিংস ও বাজার খরচ সেভ হয়েছে!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800/95 border border-indigo-500/40 text-sm font-medium text-white shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <Header
          config={config}
          onOpenAddMember={handleOpenAddMember}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenPdf={() => setIsPdfOpen(true)}
          onResetData={handleResetData}
          onLoadDemo={handleLoadDemo}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Top KPI Cards */}
          <StatsGrid 
            metrics={metrics} 
            memberCount={members.length} 
            useBazarCost={config.useBazarCost}
          />

          {/* Members Table */}
          <MemberTable
            members={metrics.members}
            metrics={metrics}
            onEditMember={handleEditMember}
            onDeleteMember={handleDeleteMember}
            onOpenAddMember={handleOpenAddMember}
          />

        </main>
      </div>

      {/* Modern Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Mess Meal Manager App</span>
            <span>•</span>
            <span>স্মার্ট, দ্রুত ও নির্ভুল মেস মিল হিসাব</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a 
              href="https://github.com/roy-sumon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
            >
              @SumonRoy
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
        currentMealRate={metrics.mealRate}
      />

      <ExpenseConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        totalDeposit={metrics.totalDeposit}
      />

      <WhatsAppShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        config={config}
        metrics={metrics}
        members={metrics.members}
      />

      <PdfExportModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        config={config}
        metrics={metrics}
        members={metrics.members}
      />

    </div>
  );
}

export default App;
