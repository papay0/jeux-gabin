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

// Removed - no longer used in production

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

// Removed - shuffle function is now in the API route

// Static game questions are no longer used - we generate questions dynamically via API
// This export is kept for compatibility but should not be used in production
export const gameQuestions: Question[] = [];

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