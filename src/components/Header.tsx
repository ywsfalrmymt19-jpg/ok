import React from 'react';
import { Smartphone, Sparkles, SlidersHorizontal, History, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onToggleSettings?: () => void;
  onToggleHistory?: () => void;
  onToggleDrMalekHub?: () => void;
  hasHistory?: boolean;
  historyCount?: number;
  showHistory?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  onToggleDrMalekHub,
  historyCount = 0,
  showHistory = false,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-semibold tracking-tight text-zinc-100">
                AuraWall Studio
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-950/80 text-purple-300 border border-purple-800/50">
                AI 9:16
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-normal">
              د. مالك الرميمة • Mobile Wallpaper & 7-Hub App
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleDrMalekHub && (
            <button
              id="dr-malek-hub-btn"
              onClick={onToggleDrMalekHub}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 border border-blue-400/40 shadow-sm transition-all active:scale-95"
              title="عرض واجهة التطبيق 3D (الأقسام السبعة)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>واجهة د. مالك</span>
            </button>
          )}

          {onToggleHistory && (
            <button
              id="history-toggle-btn"
              onClick={onToggleHistory}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showHistory
                  ? 'bg-zinc-800 text-purple-400 border border-purple-500/40'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-800/80'
              }`}
              title="View Generation History"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-600 text-white font-semibold">
                  {historyCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

