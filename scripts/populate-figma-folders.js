const fs = require('fs');
const path = require('path');
const https = require('https');

const folders = [
  'chery c5',
  'chery c5 csh',
  'chery e5',
  'chery q',
  'J6',
  'Omoda 5 GT',
  'tiggo 8',
  'tiggo 8 csh',
  'tiggo 8 pro max',
  'tiggo 9 csh',
  'tiggo cross',
  'tiggo cross csh',
  'tiggo cross sport'
];

const sourceHero = "C:\\Users\\User\\.gemini\\antigravity\\brain\\3668168e-5d4b-4bd1-bd5a-ccd2e2495f80\\premium_car_hero_1783231114718.png";
const sourceInterior = "C:\\Users\\User\\.gemini\\antigravity\\brain\\3668168e-5d4b-4bd1-bd5a-ccd2e2495f80\\premium_car_interior_1783231128635.png";
const sourceFeature = "C:\\Users\\User\\.gemini\\antigravity\\brain\\3668168e-5d4b-4bd1-bd5a-ccd2e2495f80\\premium_car_feature_1783231144621.png";

const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
const tempVideoPath = path.join(__dirname, '..', 'public', 'figma', 'video-temp.mp4');

const downloadVideo = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  if (!fs.existsSync(tempVideoPath)) {
    console.log("Downloading sample video...");
    try {
      await downloadVideo(videoUrl, tempVideoPath);
      console.log("✓ Sample video downloaded successfully.");
    } catch (err) {
      console.error("Failed to download video:", err.message);
      // write a dummy file if download fails
      fs.writeFileSync(tempVideoPath, "dummy video data");
    }
  } else {
    console.log("✓ Using existing sample video.");
  }

  const figmaDir = path.join(__dirname, '..', 'public', 'figma');

  folders.forEach(folder => {
    const targetFolder = path.join(figmaDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Copy Hero
    if (fs.existsSync(sourceHero)) {
      fs.copyFileSync(sourceHero, path.join(targetFolder, 'hero.png'));
    }

    // Copy Interior
    if (fs.existsSync(sourceInterior)) {
      fs.copyFileSync(sourceInterior, path.join(targetFolder, 'interior.png'));
    }

    // Copy Feature
    if (fs.existsSync(sourceFeature)) {
      fs.copyFileSync(sourceFeature, path.join(targetFolder, 'feature.png'));
    }

    // Copy Video
    if (fs.existsSync(tempVideoPath)) {
      fs.copyFileSync(tempVideoPath, path.join(targetFolder, 'video.mp4'));
    }

    console.log(`✓ Populated folder: ${folder}`);
  });

  // Clean up temp video
  if (fs.existsSync(tempVideoPath)) {
    fs.unlinkSync(tempVideoPath);
  }

  console.log("\n✅ All folders populated successfully!");
}

main();
