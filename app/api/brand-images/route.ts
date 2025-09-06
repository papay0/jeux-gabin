import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the JSON database
    const jsonPath = path.join(process.cwd(), 'public', 'brand-images.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const brandDatabase = JSON.parse(jsonContent);

    return NextResponse.json(brandDatabase);
  } catch (error) {
    console.error('Error reading brand images:', error);
    return NextResponse.json(
      { error: 'Failed to load brand images' },
      { status: 500 }
    );
  }
}