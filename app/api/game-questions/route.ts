import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET() {
  try {
    // Load brand images from JSON database
    const jsonPath = path.join(process.cwd(), 'public', 'brand-images.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const brandDatabase = JSON.parse(jsonContent);

    // Get all available brands that have images
    const availableBrands = Object.keys(brandDatabase).filter(
      brand => brandDatabase[brand] && brandDatabase[brand].imageUrl
    );

    // Randomize the brands for each game so questions appear in different order
    const randomizedBrands = shuffleArray(availableBrands);

    // Create 20 game questions
    const gameQuestions = randomizedBrands.slice(0, 20).map((brand, index) => {
      let options;
      
      // Special case for Gabin with custom joke options
      if (brand === 'Gabin') {
        options = shuffleArray(['Gabin', 'Gabun', 'Gabine', 'Gabon']);
      } else {
        // Get similar brands for wrong options
        const otherBrands = availableBrands.filter(b => b !== brand && b !== 'Gabin'); // Exclude Gabin from regular options
        const wrongOptions = shuffleArray(otherBrands).slice(0, 3);
        options = shuffleArray([brand, ...wrongOptions]);
      }

      return {
        id: index + 1,
        imageUrl: brandDatabase[brand].imageUrl,
        correctAnswer: brand,
        options: options,
        difficulty: getDifficulty(brand)
      };
    });

    return NextResponse.json({
      success: true,
      questions: gameQuestions,
      totalQuestions: gameQuestions.length
    });
  } catch (error) {
    console.error('Error generating game questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate game questions' },
      { status: 500 }
    );
  }
}

function getDifficulty(brand: string): 'easy' | 'medium' | 'hard' {
  const easyBrands = ['Ferrari', 'BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Ford', 'Toyota', 'Honda', 'Porsche'];
  const mediumBrands = ['Lamborghini', 'McLaren', 'Jeep', 'Volkswagen', 'Nissan', 'Range Rover', 'Land Rover'];
  
  if (easyBrands.includes(brand)) return 'easy';
  if (mediumBrands.includes(brand)) return 'medium';
  return 'hard';
}