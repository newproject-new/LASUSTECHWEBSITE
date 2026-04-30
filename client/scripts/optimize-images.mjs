import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const IMG_DIR = './public/images';
const OUTPUT_DIR = './public/images'; // Overwrite or change to a new dir

async function optimize() {
  try {
    const files = await fs.readdir(IMG_DIR);
    const images = files.filter(file => /\.(jpe?g|png)$/i.test(file));

    console.log(`Found ${images.length} images to optimize...`);

    for (const file of images) {
      const inputPath = path.join(IMG_DIR, file);
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      
      // 1. Convert to WebP
      const webpPath = path.join(OUTPUT_DIR, `${name}.webp`);
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      console.log(`✓ Converted ${file} to WebP`);

      // 2. Compress original (optional, but good for fallback)
      if (ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg') {
        const compressedPath = path.join(OUTPUT_DIR, `${name}${ext}`);
        // To avoid "input and output are same" error with sharp, we'd need a temp file
        // but for now, we prioritize WebP generation.
      }
    }

    console.log('\nOptimization complete! All images now have .webp versions.');
    console.log('Update your code to prefer .webp or use <picture> tags.');

  } catch (err) {
    console.error('Error optimizing images:', err);
    console.log('\nMake sure to run: npm install sharp');
  }
}

optimize();
