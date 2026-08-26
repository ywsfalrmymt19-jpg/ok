import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API endpoint to generate 4 variations of phone wallpapers
app.post('/api/generate-wallpapers', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '9:16',
      imageSize = '1K',
      quality = 'pro',
      referenceImage,
      count = 4,
      vibeTag,
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt describing the wallpaper vibe is required.' });
    }

    const ai = getGenAI();
    // Use gemini-3-pro-image-preview for pro/studio quality as requested, or gemini-3.1-flash-image-preview
    const modelName = quality === 'pro' 
      ? 'gemini-3-pro-image-preview' 
      : 'gemini-3.1-flash-image-preview';

    // Parse reference image if present (data:image/...;base64,...)
    let refImagePart: { inlineData: { mimeType: string; data: string } } | null = null;
    if (referenceImage && typeof referenceImage === 'string') {
      const match = referenceImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        refImagePart = {
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        };
      } else {
        // Assume raw base64 string
        refImagePart = {
          inlineData: {
            mimeType: 'image/png',
            data: referenceImage,
          },
        };
      }
    }

    const validAspectRatios = ['9:16', '1:1', '2:3', '3:2', '3:4', '4:3', '16:9', '21:9'];
    const targetAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '9:16';
    
    const validSizes = ['1K', '2K', '4K'];
    const targetImageSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const variationVariances = [
      "Variation 1: Main dynamic perspective, cinematic lighting, atmospheric phone wallpaper framing.",
      "Variation 2: Intimate close-up angle, vibrant color harmony, rich depth of field.",
      "Variation 3: Wide expansive view, high negative space for clock/lock screen icons, moody ambient tones.",
      "Variation 4: Stylized artistic rendering, intricate textures, dramatic lighting highlights.",
    ];

    const generateSingleVariation = async (index: number) => {
      try {
        const parts: any[] = [];
        
        if (refImagePart) {
          parts.push(refImagePart);
          const remixText = `Create a fresh phone wallpaper variation remixing and building upon the reference image. Desired vibe: "${prompt}". Focus on: ${variationVariances[index] || `Variation #${index + 1}`}. Maintain clean mobile wallpaper composition suitable for a phone screen.`;
          parts.push({ text: remixText });
        } else {
          const mainText = `High quality phone wallpaper: "${prompt}". Aesthetic focus: ${variationVariances[index] || `Variation #${index + 1}`}. Perfectly framed composition for vertical mobile screen background, artistic and immersive visual style.`;
          parts.push({ text: mainText });
        }

        const config: any = {
          imageConfig: {
            aspectRatio: targetAspectRatio,
            imageSize: targetImageSize,
          },
        };

        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config,
        });

        // Extract image from parts
        let imageUrl: string | null = null;
        const candidateParts = response.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }

        if (!imageUrl) {
          console.warn(`No inline image returned for variation ${index}`);
          return null;
        }

        return {
          id: `wp-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
          url: imageUrl,
          prompt,
          aspectRatio: targetAspectRatio,
          imageSize: targetImageSize,
          model: modelName,
          createdAt: Date.now(),
          isRemix: !!refImagePart,
          variationIndex: index + 1,
          vibeTag: vibeTag || undefined,
        };
      } catch (err: any) {
        console.error(`Error generating variation ${index}:`, err?.message || err);
        return null;
      }
    };

    const countToGenerate = Math.min(Math.max(count || 4, 1), 4);
    const variationPromises = Array.from({ length: countToGenerate }, (_, i) =>
      generateSingleVariation(i)
    );

    const results = await Promise.all(variationPromises);
    const validItems = results.filter((item): item is NonNullable<typeof item> => item !== null);

    if (validItems.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Unable to generate wallpapers. Please check your API key or try a different vibe description.',
      });
    }

    const batchId = `batch-${Date.now()}`;
    return res.json({
      success: true,
      batchId,
      items: validItems,
    });
  } catch (error: any) {
    console.error('Server error in /api/generate-wallpapers:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error while generating wallpapers',
    });
  }
});

// Prompt enhancer / inspiration suggestions
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are an expert mobile wallpaper art director. The user gave this short vibe or theme: "${idea}". 
Generate a vivid, evocative 1-sentence prompt optimized for phone wallpaper image generation (e.g. specifying lighting, mood, color palette, aesthetic, framing). 
Return ONLY the refined prompt text, no explanations or quotes.`,
    });

    const enhanced = response.text ? response.text.trim() : idea;
    res.json({ enhancedPrompt: enhanced });
  } catch (err: any) {
    console.error('Error enhancing prompt:', err);
    res.json({ enhancedPrompt: req.body.idea });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wallpaper generator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
