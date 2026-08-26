import React from 'react';
import { X, Trash2, Download, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { WallpaperItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: WallpaperItem[];
  onSelectWallpaper: (wp: WallpaperItem) => void;
  onRemixWallpaper: (wp: WallpaperItem) => void;
  onDownloadWallpaper: (wp: WallpaperItem, e: React.MouseEvent) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectWallpaper,
  onRemixWallpaper,
  onDownloadWallpaper,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full flex flex-col p-4 sm:p-5 shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Generation History
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-800 text-zinc-300 font-medium">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                type="button"
                onClick={onClearHistory}
                className="text-[11px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-900"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              id="close-history-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of past wallpapers */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <Sparkles className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-xs font-medium text-zinc-400">
                No past wallpapers yet
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Your generated and remixed wallpaper variations will automatically show up here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {history.map((wp, idx) => (
                <div
                  key={wp.id || `hist-${idx}`}
                  id={`history-item-${idx}`}
                  onClick={() => {
                    onSelectWallpaper(wp);
                    onClose();
                  }}
                  className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer shadow hover:border-purple-500/60 transition-all"
                >
                  <img
                    src={wp.url}
                    alt={wp.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-90 transition-opacity" />

                  {/* Top info */}
                  <div className="absolute top-1.5 inset-x-1.5 flex justify-between items-center text-[9px] font-semibold text-zinc-300">
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      {wp.aspectRatio}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-purple-300">
                      {wp.imageSize}
                    </span>
                  </div>

                  {/* Bottom Prompt / Actions */}
                  <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between gap-1">
                    <button
                      id={`history-remix-btn-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemixWallpaper(wp);
                        onClose();
                      }}
                      className="p-1 rounded bg-purple-600/90 text-white hover:bg-purple-500 transition-colors"
                      title="Remix"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      id={`history-dl-btn-${idx}`}
                      type="button"
                      onClick={(e) => onDownloadWallpaper(wp, e)}
                      className="p-1 rounded bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 transition-colors"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
