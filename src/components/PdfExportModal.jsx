import { useState, useEffect } from 'react';
import { X, Download, FileText, Loader2, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../utils/calculator';

const PdfExportModal = ({ 
  isOpen, 
  onClose, 
  config, 
  metrics, 
  members = [] 
}) => {
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('printable-report-sheet');
    if (!reportElement) return;

    setGenerating(true);
    setSuccess(false);

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      const safeName = (config.messName || 'Mess').replace(/[^\w\u0980-\u09FF]/g, '_');
      const safeMonth = (config.monthYear || 'Statement').replace(/[^\w\u0980-\u09FF]/g, '_');
      const fileName = `${safeName}_${safeMonth}_Report.pdf`;

      pdf.save(fileName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('PDF তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl my-6 rounded-2xl bg-slate-900 border border-slate-750 p-4 sm:p-6 shadow-2xl ring-1 ring-white/10"
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

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4 pr-8 sm:pr-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">প্রফেশনাল PDF রিপোর্ট</h2>
              <p className="text-xs text-slate-400">মেসের অফিসিয়াল মাসিক স্টেটমেন্ট প্রিভিউ ও ডাউনলোড</p>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={generating}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PDF তৈরি হচ্ছে...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>ডাউনলোড হয়েছে!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>PDF ডাউনলোড</span>
              </>
            )}
          </button>
        </div>

        {/* Scrollable Document Container */}
        <div className="max-h-[60vh] overflow-x-auto overflow-y-auto rounded-xl border border-slate-750 bg-slate-950 p-2 sm:p-4">
          
          {/* Printable Sheet (Standard A4 style with min-width to ensure crisp table render) */}
          <div 
            id="printable-report-sheet" 
            className="w-full min-w-[620px] bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-sm font-sans"
          >
            {/* Sheet Header */}
            <div className="border-b-2 border-slate-200 pb-5 mb-5 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {config.messName || 'Mess Meal Manager'}
                </h1>
                <p className="text-sm font-medium text-indigo-600 mt-0.5">মাসিক মিল ও খরচ হিসাব বিবরণী</p>
                <p className="text-xs text-slate-500 mt-1">তারিখ: {new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {config.monthYear}
                </span>
                <p className="text-xs text-slate-500 mt-2">মোট সদস্য: {members.length} জন</p>
              </div>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg mb-5 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">মোট জমা টাকা</span>
                <span className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(metrics.totalDeposit)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">মোট মেস খরচ</span>
                <span className="text-sm sm:text-base font-bold text-slate-900">{formatCurrency(metrics.totalCost)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">মোট মিল সংখ্যা</span>
                <span className="text-sm sm:text-base font-bold text-purple-700">{metrics.totalMeals} টি</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">মিল রেট</span>
                <span className="text-sm sm:text-base font-bold text-emerald-700">{formatCurrency(metrics.mealRate)}</span>
              </div>
            </div>

            {/* Table */}
            <div className="border border-slate-300 rounded-lg overflow-hidden mb-5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3 text-center border-r border-slate-200 w-10">নং</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">সদস্যের নাম</th>
                    <th className="py-2.5 px-3 text-center border-r border-slate-200">মোট মিল</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-200">জমা টাকা (৳)</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-200">মিল খরচ (৳)</th>
                    <th className="py-2.5 px-3 text-right">ব্যালান্স অবস্থা (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {members.map((member, idx) => (
                    <tr key={member.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">{member.name}</td>
                      <td className="py-2 px-3 text-center font-medium border-r border-slate-200 text-slate-700">{member.totalMeals}</td>
                      <td className="py-2 px-3 text-right font-medium border-r border-slate-200 text-slate-700">{formatCurrency(member.depositBalance)}</td>
                      <td className="py-2 px-3 text-right font-medium border-r border-slate-200 text-slate-700">{formatCurrency(member.individualCost)}</td>
                      <td className="py-2 px-3 text-right font-bold whitespace-nowrap">
                        {member.status === 'refund' && (
                          <span className="text-emerald-700">+ {formatCurrency(member.balance)} (ফেরত পাবে)</span>
                        )}
                        {member.status === 'due' && (
                          <span className="text-rose-700">- {formatCurrency(Math.abs(member.balance))} (দিতে হবে)</span>
                        )}
                        {member.status === 'settled' && (
                          <span className="text-slate-500">০.০০ ৳ (পরিশোধিত)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <tr>
                    <td colSpan={2} className="py-2.5 px-3 text-left border-r border-slate-200">সর্বমোট ({members.length} জন)</td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 text-purple-700">{metrics.totalMeals}</td>
                    <td className="py-2.5 px-3 text-right border-r border-slate-200">{formatCurrency(metrics.totalDeposit)}</td>
                    <td className="py-2.5 px-3 text-right border-r border-slate-200">{formatCurrency(metrics.totalCost)}</td>
                    <td className="py-2.5 px-3 text-right text-[11px] whitespace-nowrap">
                      <span className="text-emerald-700 mr-2">ফেরত: {formatCurrency(metrics.totalRefunds)}</span>
                      <span className="text-rose-700">বকেয়া: {formatCurrency(metrics.totalDues)}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signature & Note Section */}
            <div className="pt-6 mt-6 border-t border-dashed border-slate-300 flex justify-between items-end text-xs text-slate-500">
              <div>
                <p className="font-semibold text-slate-700">বিশেষ দ্রষ্টব্য:</p>
                <p>হিসাবে কোনো গরমিল পরিলক্ষিত হলে অনুগ্রহ করে দ্রুত মেস ম্যানেজারের সাথে যোগাযোগ করুন।</p>
              </div>
              <div className="text-center w-48">
                <div className="border-b border-slate-400 pb-1 mb-1"></div>
                <p className="font-semibold text-slate-800">মেস ম্যানেজার স্বাক্ষর</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PdfExportModal;
