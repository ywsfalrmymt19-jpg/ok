import React from 'react';
import { 
  Download, 
  RefreshCw, 
  Maximize2, 
  Sparkles, 
  Layers, 
  Clock, 
  Check,
  AlertCircle
} from 'lucide-react';
import { WallpaperItem, AspectRatioType } from '../types';

interface WallpaperGridProps {
  wallpapers: WallpaperItem[];
  isGenerating: boolean;
  onSelectWallpaper: (wp: WallpaperItem, index: number) => void;
  onRemixWallpaper: (wp: WallpaperItem) => void;
  onDownloadWallpaper: (wp: WallpaperItem, e: React.MouseEvent) => void;
  aspectRatio: AspectRatioType;
  loadingStep?: string;
  error?: string | null;
  onRetry?: () => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  isGenerating,
  onSelectWallpaper,
  onRemixWallpaper,
  onDownloadWallpaper,
  aspectRatio,
  loadingStep = 'Generating 4 variations with AI...',
  error,
  onRetry,
}) => {
  // Determine aspect ratio CSS class for container
  const getAspectRatioClass = (ar: AspectRatioType) => {
    switch (ar) {
      case '9:16':
        return 'aspect-[9/16]';
      case '1:1':
        return 'aspect-square';
      case '2:3':
        return 'aspect-[2/3]';
      case '3:2':
        return 'aspect-[3/2]';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-[16/9]';
      case '21:9':
        return 'aspect-[21/9]';
      default:
        return 'aspect-[9/16]';
    }
  };

  const containerAspectClass = getAspectRatioClass(aspectRatio);

  if (error && wallpapers.length === 0) {
    return (
      <div className="w-full py-12 px-4 rounded-2xl bg-zinc-900/60 border border-red-900/40 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-zinc-100 mb-1">
          Generation Encountered an Issue
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mb-4">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isGenerating ? 'Generating Variations' : 'Wallpaper Variations'}
          </span>
          <span className="text-xs font-medium text-zinc-500">
            ({wallpapers.length > 0 ? wallpapers.length : 4} in {aspectRatio})
          </span>
        </div>
        <span className="text-[11px] text-zinc-500">
          Tap image to view full screen & remix
        </span>
      </div>

      {/* 2x2 Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {isGenerating ? (
          // Loading Skeletons for 4 variations
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className={`relative ${containerAspectClass} w-full rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-800/80 p-3 flex flex-col justify-between animate-pulse`}
            >
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  Variation #{index + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              </div>

              <div className="flex flex-col items-center justify-center text-center my-auto px-2">
                <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2 animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-medium text-zinc-300">
                  Variation #{index + 1}
                </p>
                <p className="text-[9px] text-zinc-500 mt-1 line-clamp-2">
                  {index === 0 && 'Main dynamic lighting'}
                  {index === 1 && 'Intimate color depth'}
                  {index === 2 && 'Expansive negative space'}
                  {index === 3 && 'Stylized textures'}
                </p>
              </div>

              <div className="w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-shimmer"
                  style={{ width: `${(index + 1) * 25}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          // Rendered Wallpapers
          wallpapers.map((wp, index) => (
            <div
              key={wp.id || `wp-${index}`}
              id={`wallpaper-card-${index}`}
              onClick={() => onSelectWallpaper(wp, index)}
              className={`group relative ${containerAspectClass} w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/90 shadow-md hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer select-none`}
            >
              {/* Image itself */}
              <img
                src={wp.url}
                alt={wp.prompt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-40 group-hover:opacity-80 transition-opacity duration-200" />

              {/* Top Tags / Variation Number */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10 shadow-sm">
                  #{index + 1}
                </span>

                {wp.isRemix && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-500/30">
                    Remix
                  </span>
                )}
              </div>

              {/* Hover / Tap Action Overlay */}
              <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                {/* Fullscreen Button */}
                <button
                  id={`preview-btn-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWallpaper(wp, index);
                  }}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-black/70 backdrop-blur-md hover:bg-black/90 text-white text-[11px] font-medium border border-white/15 flex items-center justify-center gap-1 transition-colors active:scale-95 shadow-md"
                  title="View Fullscreen & Test Lock Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </button>

                {/* Remix Button */}
                <button
                  id={`remix-btn-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemixWallpaper(wp);
                  }}
                  className="p-1.5 rounded-lg bg-purple-600/80 backdrop-blur-md hover:bg-purple-600 text-white border border-purple-400/40 transition-colors active:scale-95 shadow-md"
                  title="Remix this wallpaper"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Download Button */}
                <button
                  id={`download-card-btn-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadWallpaper(wp, e);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 text-white border border-white/15 transition-colors active:scale-95 shadow-md"
                  title="Download Wallpaper"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
