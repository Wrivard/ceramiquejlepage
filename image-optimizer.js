// image-optimizer.js - Node.js script for batch processing
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const sizes = [400, 600, 800, 1200];
  const imageDir = './images/';
  
  // Function to process directory recursively
  async function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        await processDirectory(fullPath);
      } else if (item.isFile() && item.name.match(/\.(jpg|jpeg|png|avif)$/i)) {
        await processImage(fullPath);
      }
    }
  }
  
  // Function to process individual image
  async function processImage(imagePath) {
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath);
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|avif)$/i, '');
    const ext = path.extname(filename).toLowerCase();
    
    console.log(`Processing: ${imagePath}`);
    
    try {
      for (const size of sizes) {
        const outputPath = path.join(dir, `${nameWithoutExt}-${size}w${ext}`);
        
        // Skip if already exists
        if (fs.existsSync(outputPath)) {
          console.log(`  Skipping ${size}w (already exists)`);
          continue;
        }
        
        await sharp(imagePath)
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(outputPath);
          
        console.log(`  Created ${size}w version`);
      }
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
    }
  }
  
  await processDirectory(imageDir);
  console.log('Image optimization complete!');
}

// Run the optimization
optimizeImages().catch(console.error);
