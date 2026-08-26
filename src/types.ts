export type AspectRatioType = 
  | "9:16" 
  | "1:1" 
  | "2:3" 
  | "3:2" 
  | "3:4" 
  | "4:3" 
  | "16:9" 
  | "21:9";

export type ImageSizeType = "1K" | "2K" | "4K";

export type ModelQualityType = "flash" | "pro";

export interface WallpaperItem {
  id: string;
  url: string; // Base64 data url or hosted url
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  model: string;
  createdAt: number;
  isRemix?: boolean;
  referenceImageId?: string;
  vibeTag?: string;
  variationIndex?: number;
}

export interface WallpaperBatch {
  id: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageSizeType;
  modelQuality: ModelQualityType;
  referenceImageUrl?: string;
  timestamp: number;
  items: WallpaperItem[];
}

export interface GenerateWallpapersRequest {
  prompt: string;
  aspectRatio?: AspectRatioType;
  imageSize?: ImageSizeType;
  quality?: ModelQualityType;
  referenceImage?: string; // base64 data url or base64 string
  vibeTag?: string;
  count?: number;
}

export interface GenerateWallpapersResponse {
  success: boolean;
  batchId: string;
  items: WallpaperItem[];
  error?: string;
}

export interface VibePreset {
  id: string;
  label: string;
  prompt: string;
  category: 'aesthetic' | 'nature' | 'retro' | 'minimal' | 'cyber';
  accentColor: string;
}
