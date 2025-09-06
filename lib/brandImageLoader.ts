// Dynamic brand image loader that fetches from JSON database
// This allows real-time updates without rebuilding

interface BrandImageData {
  imageUrl: string;
  fallbackUrl?: string;
  description?: string;
  verified?: boolean;
  lastUpdated?: string;
}

let brandImageCache: Record<string, BrandImageData> | null = null;

export async function loadBrandImages(): Promise<Record<string, BrandImageData> | null> {
  if (brandImageCache) {
    return brandImageCache;
  }

  try {
    const response = await fetch('/brand-images.json');
    if (!response.ok) {
      throw new Error('Failed to load brand images');
    }
    brandImageCache = await response.json() as Record<string, BrandImageData>;
    return brandImageCache;
  } catch (error) {
    console.error('Error loading brand images:', error);
    // Fallback to default images if JSON fails to load
    return getDefaultImages();
  }
}

export async function getBrandImage(brand: string): Promise<string> {
  const images = await loadBrandImages();
  if (!images) {
    console.warn(`No images loaded for brand: ${brand}`);
    return 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=800&h=600&fit=crop';
  }
  const brandData = images[brand];
  
  if (!brandData || !brandData.imageUrl) {
    console.warn(`No image found for brand: ${brand}`);
    return 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=800&h=600&fit=crop';
  }
  
  return brandData.imageUrl;
}

// Fallback default images
function getDefaultImages(): Record<string, BrandImageData> {
  return {
    'Ferrari': {
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop'
    },
    'BMW': {
      imageUrl: 'https://images.unsplash.com/photo-1555215858-9dc80cd5b8df?w=800&h=600&fit=crop'
    },
    // Add other defaults as needed
  };
}