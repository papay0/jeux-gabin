import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, imageUrl, description } = body;

    if (!brand || !imageUrl) {
      return NextResponse.json(
        { error: 'Brand and imageUrl are required' },
        { status: 400 }
      );
    }

    // Log the update for debugging
    console.log(`Updating ${brand} with image: ${imageUrl}`);

    // Read the current JSON database
    const jsonPath = path.join(process.cwd(), 'public', 'brand-images.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const brandDatabase = JSON.parse(jsonContent);

    // Check if brand exists
    if (!brandDatabase[brand]) {
      return NextResponse.json(
        { error: `Brand ${brand} not found in database` },
        { status: 404 }
      );
    }

    // Update the brand's image data
    brandDatabase[brand] = {
      ...brandDatabase[brand],
      imageUrl: imageUrl,
      description: description || brandDatabase[brand].description,
      verified: true,
      lastUpdated: new Date().toISOString()
    };

    // Write the updated JSON back to file
    fs.writeFileSync(jsonPath, JSON.stringify(brandDatabase, null, 2));

    // Also update the TypeScript file for consistency
    const tsPath = path.join(process.cwd(), 'lib', 'verifiedBrandImages.ts');
    if (fs.existsSync(tsPath)) {
      let tsContent = fs.readFileSync(tsPath, 'utf8');
      const brandKey = brand.toUpperCase().replace(/[-\s]/g, '_');
      const pattern = new RegExp(
        `(${brandKey}_IMAGES.*?imageUrl:\\s*')[^']+(')`,
        's'
      );
      if (tsContent.match(pattern)) {
        tsContent = tsContent.replace(pattern, `$1${imageUrl}$2`);
        fs.writeFileSync(tsPath, tsContent);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${brand} image successfully in JSON database`,
      brand,
      imageUrl,
      description: description || brandDatabase[brand].description,
      jsonPath: '/brand-images.json'
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return instructions for how to use this endpoint
  return NextResponse.json({
    instructions: 'POST to this endpoint with JSON body containing: { brand: string, imageUrl: string, description?: string }',
    example: {
      brand: 'Ferrari',
      imageUrl: 'https://images.unsplash.com/photo-xxxxx',
      description: 'Red Ferrari F40'
    },
    availableBrands: [
      'Ferrari', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Porsche',
      'Lamborghini', 'McLaren', 'Jeep', 'Toyota', 'Honda', 'Nissan',
      'Ford', 'Chevrolet', 'Volkswagen', 'Range Rover', 'Land Rover',
      'Mini', 'Peugeot', 'Renault'
    ]
  });
}