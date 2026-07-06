const fs = require('fs');
const path = require('path');

const cars = [
  'chery-q', 'chery-j6-bev', 'chery-j6-csh', 'chery-j6-ice',
  'chery-e5-bev', 'chery-e5-csh', 'chery-e5-ice', 'chery-c5-csh',
  'chery-omoda-e5', 'chery-tiggo-8-pro-max', 'chery-omoda-5-gt'
];

const baseDir = path.join(__dirname, '..', 'public', 'images', 'cars');

// Create directories
cars.forEach(car => {
  const dir = path.join(baseDir, car);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

// Maps cars to their placeholder images
const placeholderMap = {
  'chery-q': 'public/figma/car-q.png',
  'chery-j6-bev': 'public/figma/car-j6.png',
  'chery-j6-csh': 'public/figma/car-j6.png',
  'chery-j6-ice': 'public/figma/car-j6.png',
  'chery-e5-bev': 'public/figma/car-e5.png',
  'chery-e5-csh': 'public/figma/car-e5.png',
  'chery-e5-ice': 'public/figma/car-e5.png',
  'chery-c5-csh': 'public/figma/car-c5csh.png',
  'chery-omoda-e5': 'public/figma/pdp/black-platinum-car.png',
  'chery-tiggo-8-pro-max': 'public/figma/pdp/black-platinum-car.png',
  'chery-omoda-5-gt': 'public/figma/pdp/black-platinum-car.png'
};

// Copy placeholder images to each car folder (as silver.png)
Object.entries(placeholderMap).forEach(([car, src]) => {
  const dest = path.join(baseDir, car, 'silver.png');
  const srcPath = path.join(__dirname, '..', src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dest);
    console.log(`Copied: ${src} -> ${path.relative(path.join(__dirname, '..'), dest)}`);
  } else {
    console.log(`Warning: Source not found: ${srcPath}`);
  }
});

console.log('\n✅ Setup complete! Placeholder images are ready.');