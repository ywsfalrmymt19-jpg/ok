import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VibeInput } from './components/VibeInput';
import { WallpaperGrid } from './components/WallpaperGrid';
import { FullScreenModal } from './components/FullScreenModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { DrMalekHubModal } from './components/DrMalekHubModal';
import { AspectRatioType, ImageSizeType, ModelQualityType, WallpaperItem } from './types';
import { INITIAL_FEATURED_WALLPAPERS } from './data/presets';
import { Sparkles, Info } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState<string>(
    'rainy cyberpunk lo-fi alleyway with neon signs and reflective wet puddles'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [imageSize, setImageSize] = useState<ImageSizeType>('2K');
  const [quality, setQuality] = useState<ModelQualityType>('pro');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>(INITIAL_FEATURED_WALLPAPERS);
  const [history, setHistory] = useState<WallpaperItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurawall_history');
      return saved ? JSON.parse(saved) : INITIAL_FEATURED_WALLPAPERS;
    } catch {
      return INITIAL_FEATURED_WALLPAPERS;
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWallpaperIndex, setSelectedWallpaperIndex] = useState<number | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showDrMalekHub, setShowDrMalekHub] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      // Keep most recent 30 items
      const trimmed = history.slice(0, 30);
      localStorage.setItem('aurawall_history', JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [history]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-wallpapers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          imageSize,
          quality,
          referenceImage: referenceImage || undefined,
          count: 4,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate wallpapers');
      }

      const newItems: WallpaperItem[] = data.items;
      setWallpapers(newItems);
      setHistory((prev) => [...newItems, ...prev]);
      showToast('Generated 4 new wallpaper variations!');
    } catch (err: any) {
      console.error('Error generating wallpapers:', err);
      setError(err?.message || 'Error generating wallpapers. Please verify your connection.');
      showToast(err?.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemix = (wp: WallpaperItem) => {
    setReferenceImage(wp.url);
    setPrompt(wp.prompt || prompt);
    setAspectRatio(wp.aspectRatio || '9:16');
    showToast('Loaded wallpaper into Remix mode!');
    
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async (wp: WallpaperItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const sanitizedPrompt = (wp.prompt || 'wallpaper')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);
      const filename = `aurawall-${sanitizedPrompt}-${wp.aspectRatio.replace(':', 'x')}-${wp.imageSize}.png`;

      // Handle data url directly or fetch blob
      if (wp.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = wp.url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Wallpaper downloaded!');
      } else {
        const res = await fetch(wp.url);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        showToast('Wallpaper downloaded!');
      }
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: open in new tab
      window.open(wp.url, '_blank');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('aurawall_history');
    } catch {}
    showToast('History cleared');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-zinc-900/95 text-white text-xs font-medium border border-purple-500/40 shadow-2xl shadow-purple-500/20 backdrop-blur-md flex items-center gap-2 animate-bounce-short">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onToggleHistory={() => setShowHistoryDrawer(true)}
        onToggleDrMalekHub={() => setShowDrMalekHub(true)}
        historyCount={history.length}
        showHistory={showHistoryDrawer}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3.5 sm:px-4 py-4 space-y-6">
        {/* Vibe Input & Quality Controls */}
        <VibeInput
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          imageSize={imageSize}
          setImageSize={setImageSize}
          quality={quality}
          setQuality={setQuality}
          referenceImage={referenceImage}
          onClearReferenceImage={() => setReferenceImage(null)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* 4 Wallpaper Variations Grid */}
        <WallpaperGrid
          wallpapers={wallpapers}
          isGenerating={isGenerating}
          onSelectWallpaper={(wp, index) => setSelectedWallpaperIndex(index)}
          onRemixWallpaper={handleRemix}
          onDownloadWallpaper={handleDownload}
          aspectRatio={aspectRatio}
          error={error}
          onRetry={handleGenerate}
        />
      </main>

      {/* Fullscreen Wallpaper Modal with Phone Lock Screen Simulator */}
      {selectedWallpaperIndex !== null && wallpapers[selectedWallpaperIndex] && (
        <FullScreenModal
          wallpaper={wallpapers[selectedWallpaperIndex]}
          currentIndex={selectedWallpaperIndex}
          totalCount={wallpapers.length}
          onClose={() => setSelectedWallpaperIndex(null)}
          onRemix={handleRemix}
          onDownload={handleDownload}
          onNavigate={(newIdx) => setSelectedWallpaperIndex(newIdx)}
        />
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        history={history}
        onSelectWallpaper={(wp) => {
          // Open selected wallpaper
          const idx = wallpapers.findIndex((w) => w.id === wp.id);
          if (idx !== -1) {
            setSelectedWallpaperIndex(idx);
          } else {
            setWallpapers([wp, ...wallpapers.slice(0, 3)]);
            setSelectedWallpaperIndex(0);
          }
        }}
        onRemixWallpaper={handleRemix}
        onDownloadWallpaper={handleDownload}
        onClearHistory={handleClearHistory}
      />

      {/* Dr. Malek 3D 7-Section Hub Modal */}
      <DrMalekHubModal
        isOpen={showDrMalekHub}
        onClose={() => setShowDrMalekHub(false)}
      />
    </div>
  );
}
