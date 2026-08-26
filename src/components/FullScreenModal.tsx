import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Info,
  Check,
  Share2,
  Copy,
  Sliders,
  Smartphone
} from 'lucide-react';
import { WallpaperItem } from '../types';

interface FullScreenModalProps {
  wallpaper: WallpaperItem | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onRemix: (wp: WallpaperItem) => void;
  onDownload: (wp: WallpaperItem) => void;
  onNavigate: (newIndex: number) => void;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({
  wallpaper,
  currentIndex,
  totalCount,
  onClose,
  onRemix,
  onDownload,
  onNavigate,
}) => {
  const [showLockScreenOverlay, setShowLockScreenOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDate, setCurrentDate] = useState<string>('Tuesday, August 25');
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Update mock lockscreen clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation (ESC to close, Left/Right arrows to switch variations)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < totalCount - 1) {
        onNavigate(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCount, onClose, onNavigate]);

  if (!wallpaper) return null;

  const handleCopyPrompt = () => {
    if (!wallpaper.prompt) return;
    navigator.clipboard.writeText(wallpaper.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Top Bar Floating Controls */}
      <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Variation Indicator & Aspect Ratio badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-xs font-semibold text-zinc-200 border border-zinc-700/60 shadow-lg">
            Variation {currentIndex + 1} of {totalCount}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-xs font-mono text-purple-300 border border-purple-500/30">
            {wallpaper.aspectRatio}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-xs font-medium text-indigo-300 border border-indigo-500/30">
            {wallpaper.imageSize}
          </span>
        </div>

        {/* Right: Lock Screen Toggle & Close */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="toggle-lockscreen-overlay-btn"
            type="button"
            onClick={() => setShowLockScreenOverlay(!showLockScreenOverlay)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-1.5 transition-all shadow-lg border ${
              showLockScreenOverlay
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-zinc-900/80 text-zinc-300 hover:text-white border-zinc-700/60 hover:bg-zinc-800'
            }`}
            title="Preview Lock Screen UI Overlay"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {showLockScreenOverlay ? 'Hide Phone UI' : 'Phone Lock UI'}
            </span>
          </button>

          <button
            id="close-fullscreen-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-700/60 transition-colors shadow-lg"
            title="Close Preview (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          id="prev-wallpaper-btn"
          type="button"
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-2 sm:left-4 z-30 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md text-white border border-zinc-700/60 transition-all shadow-xl hover:scale-105 active:scale-95"
          title="Previous Variation (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {currentIndex < totalCount - 1 && (
        <button
          id="next-wallpaper-btn"
          type="button"
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-2 sm:right-4 z-30 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-md text-white border border-zinc-700/60 transition-all shadow-xl hover:scale-105 active:scale-95"
          title="Next Variation (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Main Wallpaper Phone Frame */}
      <div className="relative max-h-[82vh] sm:max-h-[85vh] h-full flex items-center justify-center">
        <div 
          className="relative max-h-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/40 border border-zinc-700/80 bg-zinc-950 flex items-center justify-center group"
          style={{ height: '100%' }}
        >
          {/* Main Image */}
          <img
            src={wallpaper.url}
            alt={wallpaper.prompt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Simulated Lock Screen Overlay */}
          {showLockScreenOverlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 flex flex-col justify-between p-6 select-none pointer-events-none animate-fadeIn text-white font-sans">
              {/* Top Lock Screen Header */}
              <div className="text-center pt-8">
                <div className="flex justify-center mb-1">
                  <Lock className="w-4 h-4 text-white/80" />
                </div>
                <div className="text-xs font-medium text-white/90 tracking-wide uppercase">
                  {currentDate}
                </div>
                <div className="text-5xl sm:text-6xl font-light tracking-tight text-white drop-shadow-md">
                  {currentTime}
                </div>
              </div>

              {/* Sample Notification Widget */}
              <div className="mx-auto w-full max-w-xs bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-300" /> AuraWall
                  </span>
                  <span>Now</span>
                </div>
                <p className="text-xs font-medium text-white">
                  Wallpaper looks crisp in {wallpaper.imageSize} ({wallpaper.aspectRatio})
                </p>
              </div>

              {/* Bottom Phone Bar & Torch/Camera Icons */}
              <div className="pb-4">
                <div className="flex justify-between items-center px-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/90">
                    <span className="text-xs font-bold">🔦</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white/90">
                    <span className="text-xs font-bold">📷</span>
                  </div>
                </div>
                <div className="w-32 h-1 bg-white/70 rounded-full mx-auto" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Dock */}
      <div className="absolute bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30 flex items-center justify-center gap-2.5 bg-zinc-900/90 backdrop-blur-xl p-2 rounded-2xl border border-zinc-700/80 shadow-2xl max-w-md w-full">
        {/* Remix Action Button */}
        <button
          id="modal-remix-btn"
          type="button"
          onClick={() => {
            onRemix(wallpaper);
            onClose();
          }}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/30"
          title="Remix this image as visual reference for the next batch"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Remix Wallpaper</span>
        </button>

        {/* Download Action Button */}
        <button
          id="modal-download-btn"
          type="button"
          onClick={() => onDownload(wallpaper)}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all border border-zinc-600/60 shadow-lg"
          title="Download High Quality Image"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download ({wallpaper.imageSize})</span>
        </button>

        {/* Info / Prompt Details Toggle */}
        <button
          id="modal-info-btn"
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className={`p-2.5 rounded-xl border transition-colors ${
            showInfo 
              ? 'bg-zinc-800 text-purple-400 border-purple-500/50' 
              : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
          }`}
          title="Wallpaper Prompt Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Info Flyout Drawer */}
      {showInfo && (
        <div className="absolute bottom-20 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md w-full bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 shadow-2xl z-40 text-left animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Prompt & Vibe Details
            </span>
            <button
              onClick={handleCopyPrompt}
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80">
            "{wallpaper.prompt}"
          </p>
          <div className="mt-2.5 grid grid-cols-3 gap-2 text-[10px] text-zinc-400">
            <div className="bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
              <span className="block text-zinc-500">Ratio:</span>
              <span className="font-semibold text-zinc-300">{wallpaper.aspectRatio}</span>
            </div>
            <div className="bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
              <span className="block text-zinc-500">Resolution:</span>
              <span className="font-semibold text-indigo-300">{wallpaper.imageSize}</span>
            </div>
            <div className="bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
              <span className="block text-zinc-500">Engine:</span>
              <span className="font-semibold text-amber-300 truncate block">{wallpaper.model.replace('-preview', '')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
