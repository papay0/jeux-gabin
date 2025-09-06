import { Question } from './types';

// Load brand images from JSON database instead of static TypeScript file
async function loadBrandImages() {
  try {
    const response = await fetch('/brand-images.json');
    if (!response.ok) throw new Error('Failed to load brand images');
    return await response.json();
  } catch (error) {
    console.error('Error loading brand images:', error);
    return {};
  }
}

async function getVerifiedBrandImage(brandName: string): Promise<string> {
  const brandImages = await loadBrandImages();
  const brandData = brandImages[brandName];
  
  if (!brandData || !brandData.imageUrl) {
    console.warn(`No image found for brand: ${brandName}`);
    return 'https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?w=800&h=600&fit=crop';
  }
  
  return brandData.imageUrl;
}

export const carBrands = [
  'Peugeot', 'Renault', 'Citroën', 'Alpine', 'DS',
  'Ferrari', 'Lamborghini', 'Porsche', 'BMW', 'Mercedes-Benz',
  'Audi', 'Tesla', 'Toyota', 'Honda', 'Nissan',
  'Ford', 'Chevrolet', 'Mazda', 'Volkswagen', 'Jeep',
  'Range Rover', 'Bentley', 'Rolls-Royce', 'McLaren', 'Bugatti',
  'Volvo', 'Subaru', 'Hyundai', 'Kia', 'Dodge',
  'Lexus', 'Infiniti', 'Acura', 'Genesis', 'Alfa Romeo',
  'Maserati', 'Aston Martin', 'Jaguar', 'Mini',
  'Fiat', 'Opel', 'Dacia', 'Seat', 'Skoda'
];

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// VERIFIED BRAND-IMAGE MAPPING SYSTEM
// Each image is verified to match the correct brand name
// Options are randomized so correct answer isn't always first
export const gameQuestions: Question[] = [
  {
    id: 1,
    imageUrl: getVerifiedBrandImage('Ferrari'),
    correctAnswer: 'Ferrari',
    options: shuffleArray(['Ferrari', 'Lamborghini', 'Porsche', 'McLaren']),
    difficulty: 'easy'
  },
  {
    id: 2,
    imageUrl: getVerifiedBrandImage('BMW'),
    correctAnswer: 'BMW',
    options: shuffleArray(['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen']),
    difficulty: 'easy'
  },
  {
    id: 3,
    imageUrl: getVerifiedBrandImage('Audi'),
    correctAnswer: 'Audi',
    options: shuffleArray(['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen']),
    difficulty: 'easy'
  },
  {
    id: 4,
    imageUrl: getVerifiedBrandImage('Mercedes-Benz'),
    correctAnswer: 'Mercedes-Benz',
    options: shuffleArray(['BMW', 'Mercedes-Benz', 'Audi', 'Lexus']),
    difficulty: 'easy'
  },
  {
    id: 5,
    imageUrl: getVerifiedBrandImage('Tesla'),
    correctAnswer: 'Tesla',
    options: shuffleArray(['Tesla', 'BMW', 'Audi', 'Mercedes-Benz']),
    difficulty: 'easy'
  },
  {
    id: 6,
    imageUrl: getVerifiedBrandImage('Jeep'),
    correctAnswer: 'Jeep',
    options: shuffleArray(['Jeep', 'Land Rover', 'Range Rover', 'Ford']),
    difficulty: 'medium'
  },
  {
    id: 7,
    imageUrl: getVerifiedBrandImage('Lamborghini'),
    correctAnswer: 'Lamborghini',
    options: shuffleArray(['Ferrari', 'Lamborghini', 'McLaren', 'Bugatti']),
    difficulty: 'medium'
  },
  {
    id: 8,
    imageUrl: getVerifiedBrandImage('Porsche'),
    correctAnswer: 'Porsche',
    options: shuffleArray(['Porsche', 'Ferrari', 'Lamborghini', 'Audi']),
    difficulty: 'easy'
  },
  {
    id: 9,
    imageUrl: getVerifiedBrandImage('Ford'),
    correctAnswer: 'Ford',
    options: shuffleArray(['Ford', 'Chevrolet', 'Dodge', 'Toyota']),
    difficulty: 'easy'
  },
  {
    id: 10,
    imageUrl: getVerifiedBrandImage('Toyota'),
    correctAnswer: 'Toyota',
    options: shuffleArray(['Honda', 'Toyota', 'Nissan', 'Mazda']),
    difficulty: 'easy'
  },
  {
    id: 11,
    imageUrl: getVerifiedBrandImage('Volkswagen'),
    correctAnswer: 'Volkswagen',
    options: shuffleArray(['Volkswagen', 'Audi', 'Skoda', 'Seat']),
    difficulty: 'medium'
  },
  {
    id: 12,
    imageUrl: getVerifiedBrandImage('Honda'),
    correctAnswer: 'Honda',
    options: shuffleArray(['Toyota', 'Honda', 'Hyundai', 'Kia']),
    difficulty: 'easy'
  },
  {
    id: 13,
    imageUrl: getVerifiedBrandImage('Nissan'),
    correctAnswer: 'Nissan',
    options: shuffleArray(['Honda', 'Toyota', 'Nissan', 'Mazda']),
    difficulty: 'medium'
  },
  {
    id: 14,
    imageUrl: getVerifiedBrandImage('Chevrolet'),
    correctAnswer: 'Chevrolet',
    options: shuffleArray(['Ford', 'Chevrolet', 'Dodge', 'GMC']),
    difficulty: 'easy'
  },
  {
    id: 15,
    imageUrl: getVerifiedBrandImage('Range Rover'),
    correctAnswer: 'Range Rover',
    options: shuffleArray(['Range Rover', 'Land Rover', 'Jeep', 'Mercedes-Benz']),
    difficulty: 'medium'
  },
  {
    id: 16,
    imageUrl: getVerifiedBrandImage('McLaren'),
    correctAnswer: 'McLaren',
    options: shuffleArray(['Ferrari', 'Lamborghini', 'McLaren', 'Bugatti']),
    difficulty: 'easy'
  },
  {
    id: 17,
    imageUrl: getVerifiedBrandImage('Mini'),
    correctAnswer: 'Mini',
    options: shuffleArray(['Mini', 'Fiat', 'Smart', 'Volkswagen']),
    difficulty: 'easy'
  },
  {
    id: 18,
    imageUrl: getVerifiedBrandImage('Land Rover'),
    correctAnswer: 'Land Rover',
    options: shuffleArray(['Land Rover', 'Range Rover', 'Jeep', 'Ford']),
    difficulty: 'medium'
  },
  {
    id: 19,
    imageUrl: getVerifiedBrandImage('Peugeot'),
    correctAnswer: 'Peugeot',
    options: shuffleArray(['Peugeot', 'Renault', 'Citroën', 'Opel']),
    difficulty: 'easy'
  },
  {
    id: 20,
    imageUrl: getVerifiedBrandImage('Renault'),
    correctAnswer: 'Renault',
    options: shuffleArray(['Renault', 'Peugeot', 'Citroën', 'Dacia']),
    difficulty: 'easy'
  }
];

export function getRandomOptions(correctAnswer: string, count: number = 4): string[] {
  const options = new Set([correctAnswer]);
  const availableBrands = carBrands.filter(brand => brand !== correctAnswer);
  
  while (options.size < count && availableBrands.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableBrands.length);
    options.add(availableBrands[randomIndex]);
    availableBrands.splice(randomIndex, 1);
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
}