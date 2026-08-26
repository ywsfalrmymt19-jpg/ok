import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Film, 
  Video, 
  Users, 
  FileText, 
  Layers, 
  Tv, 
  Gamepad2, 
  Phone, 
  MessageSquare, 
  ExternalLink,
  Smartphone,
  Sparkles
} from 'lucide-react';

interface DrMalekHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DrMalekHubModal: React.FC<DrMalekHubModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      window.open('https://www.google.com', '_blank');
      return;
    }
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 animate-fadeIn" dir="rtl">
      {/* Container Box styled like the 3D mobile screen */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 rounded-[32px] border-4 border-zinc-800 shadow-2xl p-4 sm:p-5 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        
        {/* Top Close Button & Status Bar */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>واجهة د. مالك الرميمة 3D</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/20 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-white hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Google Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full mb-4">
          <div className="flex items-center bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-zinc-300 dark:border-zinc-700 px-3.5 py-2.5">
            <span className="text-blue-600 font-black text-lg pl-2">G</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="محرك جوجل للبحث..."
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none pr-2 text-right"
            />
            <button
              type="submit"
              className="p-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* 2. Main 7 Interactive 3D Cards */}
        <div className="space-y-3 flex-1">
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Card 1: مقاطع ريلز */}
            <button
              onClick={() => openLink('https://www.youtube.com/shorts')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-purple-500 hover:shadow-purple-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                مقاطع ريلز
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-purple-600 dark:text-purple-400">1</span>
            </button>

            {/* Card 2: فيديوهات جديدة */}
            <button
              onClick={() => openLink('https://www.youtube.com')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-red-500 hover:shadow-red-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 to-pink-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                فيديوهات جديدة
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-red-600 dark:text-red-400">2</span>
            </button>

            {/* Card 3: الأصدقاء + ريلز */}
            <button
              onClick={() => openLink('https://www.facebook.com')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-blue-500 hover:shadow-blue-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                الأصدقاء + ريلز
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">3</span>
            </button>
          </div>

          {/* Row 2: 3 cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Card 4: المنشورات */}
            <button
              onClick={() => openLink('https://twitter.com')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-500 hover:shadow-emerald-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                المنشورات
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">4</span>
            </button>

            {/* Card 5: المجموعات */}
            <button
              onClick={() => openLink('https://t.me')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-amber-500 hover:shadow-amber-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                المجموعات
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">5</span>
            </button>

            {/* Card 6: المسلسلات */}
            <button
              onClick={() => openLink('https://www.youtube.com/results?search_query=series')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-lg border border-zinc-200 dark:border-zinc-700/80 hover:border-violet-500 hover:shadow-violet-500/20 active:scale-95 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-md mb-1.5 group-hover:scale-110 transition-transform">
                <Tv className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                المسلسلات
              </span>
              <span className="absolute top-1 left-1.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">6</span>
            </button>
          </div>

          {/* Row 3: Card 7 - الألعاب (Full Width) */}
          <button
            onClick={() => openLink('https://poki.com')}
            className="group relative w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow group-hover:rotate-6 transition-transform">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <div className="text-right">
                <span className="text-base font-black tracking-wide block">
                  الألعاب (7)
                </span>
                <span className="text-xs text-white/80">
                  منصات ألعاب الويب الخفيفة و HTML5
                </span>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* 3. Footer Doctor Signature */}
        <div className="mt-4 pt-3 border-t border-zinc-300 dark:border-zinc-800">
          <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-2xl p-3 text-center border border-zinc-200 dark:border-zinc-700/60 shadow-md">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              تصميم وبرمجة الدكتور / مالك الرميمة
            </h4>
            <a
              href="https://wa.me/967771134103"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب / اتصال: 771134103</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
