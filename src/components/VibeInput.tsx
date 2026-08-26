import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Dices, 
  X, 
  SlidersHorizontal, 
  Layers, 
  Monitor, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap
} from 'lucide-react';
import { AspectRatioType, ImageSizeType, ModelQualityType } from '../types';
import { VIBE_PRESETS } from '../data/presets';

interface VibeInputProps {
  prompt: string;
  setPrompt: (p: string) => void;
  aspectRatio: AspectRatioType;
  setAspectRatio: (ar: AspectRatioType) => void;
  imageSize: ImageSizeType;
  setImageSize: (size: ImageSizeType) => void;
  quality: ModelQualityType;
  setQuality: (q: ModelQualityType) => void;
  referenceImage: string | null;
  onClearReferenceImage: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const VibeInput: React.FC<VibeInputProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  imageSize,
  setImageSize,
  quality,
  setQuality,
  referenceImage,
  onClearReferenceImage,
  onGenerate,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const aspectRatios: { value: AspectRatioType; label: string; iconDesc: string }[] = [
    { value: '9:16', label: '9:16 (Phone)', iconDesc: 'Mobile Vertical' },
    { value: '1:1', label: '1:1 (Square)', iconDesc: 'Square' },
    { value: '2:3', label: '2:3 (Portrait)', iconDesc: 'Tall Portrait' },
    { value: '3:2', label: '3:2 (Landscape)', iconDesc: 'Standard Horiz' },
    { value: '3:4', label: '3:4 (Photo)', iconDesc: 'Standard Vert' },
    { value: '4:3', label: '4:3 (Display)', iconDesc: 'Monitor' },
    { value: '16:9', label: '16:9 (Desktop)', iconDesc: 'Widescreen' },
    { value: '21:9', label: '21:9 (Ultrawide)', iconDesc: 'Ultrawide' },
  ];

  const resolutions: { value: ImageSizeType; label: string; desc: string }[] = [
    { value: '1K', label: '1K', desc: 'Standard Fast' },
    { value: '2K', label: '2K', desc: 'Crisp HD' },
    { value: '4K', label: '4K', desc: 'Ultra Detail' },
  ];

  const handleSurpriseMe = () => {
    const random = VIBE_PRESETS[Math.floor(Math.random() * VIBE_PRESETS.length)];
    setPrompt(random.prompt);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.enhancedPrompt) {
          setPrompt(data.enhancedPrompt);
        }
      }
    } catch (err) {
      console.error('Failed to enhance prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 backdrop-blur-md">
      {/* Reference Image Remix Banner */}
      {referenceImage && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-purple-500/50 flex-shrink-0 bg-black">
              <img
                src={referenceImage}
                alt="Reference for remixing"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 inset-x-0 bg-purple-900/90 text-[9px] font-semibold text-purple-200 text-center py-0.5">
                Ref
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
                <span className="text-xs font-semibold text-purple-200">
                  Remix Mode Active
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80 truncate">
                New batch will blend this visual reference with your vibe prompt below
              </p>
            </div>
          </div>
          <button
            id="clear-remix-ref-btn"
            onClick={onClearReferenceImage}
            className="p-1.5 text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-lg transition-colors flex-shrink-0"
            title="Clear reference image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative">
        <label htmlFor="vibe-prompt-input" className="sr-only">
          Wallpaper Vibe Prompt
        </label>
        <textarea
          id="vibe-prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your current vibe (e.g., 'rainy cyberpunk lo-fi alleyway', 'dark OLED minimalist prism', 'ghibli clouds at dusk')..."
          rows={3}
          className="w-full bg-zinc-950/90 text-zinc-100 text-sm sm:text-base placeholder:text-zinc-500 rounded-xl p-3.5 pr-10 border border-zinc-700/70 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-none font-normal leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              onGenerate();
            }
          }}
        />

        {/* Action icons in textarea corner */}
        <div className="absolute right-2.5 bottom-3 flex items-center gap-1">
          <button
            id="surprise-vibe-btn"
            type="button"
            onClick={handleSurpriseMe}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-zinc-800 transition-colors"
            title="Surprise me with a random vibe"
          >
            <Dices className="w-4 h-4" />
          </button>
          <button
            id="enhance-prompt-btn"
            type="button"
            onClick={handleEnhancePrompt}
            disabled={!prompt.trim() || isEnhancing}
            className={`p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors ${
              isEnhancing ? 'animate-pulse text-amber-400' : ''
            }`}
            title="Refine prompt with AI"
          >
            <Wand2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset vibe chips horizontal scroll */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Quick Vibe Inspo:
          </span>
          <button
            id="toggle-advanced-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
            <span>Format & Quality ({aspectRatio} • {imageSize})</span>
            {showAdvanced ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {VIBE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              id={`preset-${preset.id}`}
              type="button"
              onClick={() => setPrompt(preset.prompt)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all whitespace-nowrap active:scale-95"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: preset.accentColor }}
              />
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Advanced Controls: Aspect Ratio, Resolution, Model Quality */}
      {showAdvanced && (
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 space-y-3.5 animate-fadeIn">
          {/* Aspect Ratio Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-purple-400" />
                Aspect Ratio:
              </label>
              <span className="text-[11px] text-zinc-400">
                Default: 9:16 (Phone Vertical)
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.value}
                  id={`ar-btn-${ar.value.replace(':', '-')}`}
                  type="button"
                  onClick={() => setAspectRatio(ar.value)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-center border ${
                    aspectRatio === ar.value
                      ? 'bg-purple-600/30 text-purple-200 border-purple-500 font-semibold shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                  title={ar.iconDesc}
                >
                  <div className="font-mono text-[11px]">{ar.value}</div>
                  <div className="text-[9px] opacity-75 truncate">
                    {ar.value === '9:16' ? 'Mobile' : ar.value === '1:1' ? 'Square' : ar.value}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selector & Model Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Image Resolution */}
            <div>
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                Resolution / Size:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {resolutions.map((res) => (
                  <button
                    key={res.value}
                    id={`res-btn-${res.value}`}
                    type="button"
                    onClick={() => setImageSize(res.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-center ${
                      imageSize === res.value
                        ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500 font-semibold'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span className="font-bold">{res.value}</span>
                    <span className="block text-[9px] opacity-70">{res.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Quality */}
            <div>
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Generation Engine:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  id="model-pro-btn"
                  type="button"
                  onClick={() => setQuality('pro')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-left ${
                    quality === 'pro'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/80 font-semibold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-amber-300 flex items-center gap-1">
                    <span>Pro Studio</span>
                    <span className="text-[9px] px-1 bg-amber-500/30 text-amber-200 rounded">Top Quality</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 block truncate">gemini-3-pro-image-preview</span>
                </button>

                <button
                  id="model-flash-btn"
                  type="button"
                  onClick={() => setQuality('flash')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-left ${
                    quality === 'flash'
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/80 font-semibold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-semibold text-purple-300 flex items-center gap-1">
                    <span>Flash Fast</span>
                  </div>
                  <span className="text-[9px] text-zinc-400 block truncate">gemini-3.1-flash-image-preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Generate Button */}
      <div className="mt-4">
        <button
          id="generate-wallpapers-btn"
          type="button"
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] ${
            !prompt.trim() || isGenerating
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : referenceImage
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white shadow-purple-600/30 border border-purple-400/30 hover:shadow-purple-600/50'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-indigo-600/30 border border-indigo-400/30 hover:shadow-purple-600/50'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating 4 Variations ({aspectRatio})...</span>
            </>
          ) : referenceImage ? (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Remix & Generate 4 Variations ({aspectRatio})</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate 4 Variations ({aspectRatio})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
