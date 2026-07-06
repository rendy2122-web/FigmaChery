# Chery Car Images Download Guide

## Folder Structure Created:
```
public/images/cars/
├── chery-q/
├── chery-j6-bev/
├── chery-j6-csh/
├── chery-j6-ice/
├── chery-e5-bev/
├── chery-e5-csh/
├── chery-e5-ice/
├── chery-c5-csh/
├── chery-omoda-e5/
├── chery-tiggo-8-pro-max/
└── chery-omoda-5-gt/
```

## Image Sources:

### Official Chery Websites:
1. **Chery Global**: https://www.chery.com/global/
2. **Chery Indonesia**: https://www.chery.co.id/
3. **Chery Global Media**: https://www.chery.com/global/media

### Direct Image URLs (Right-click → Save Image As):

## CHERY Q (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/chery-q/silver.jpg
- **Black**: https://www.chery.com/global/media/images/chery-q/black.jpg
- **White**: https://www.chery.com/global/media/images/chery-q/white.jpg
- **Red**: https://www.chery.com/global/media/images/chery-q/red.jpg

## CHERY J6 BEV (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/j6-bev/silver.jpg
- **Black**: https://www.chery.com/global/media/images/j6-bev/black.jpg
- **White**: https://www.chery.com/global/media/images/j6-bev/white.jpg
- **Blue**: https://www.chery.com/global/media/images/j6-bev/blue.jpg

## CHERY J6 CSH (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/j6-csh/silver.jpg
- **Black**: https://www.chery.com/global/media/images/j6-csh/black.jpg
- **White**: https://www.chery.com/global/media/images/j6-csh/white.jpg
- **Blue**: https://www.chery.com/global/media/images/j6-csh/blue.jpg

## CHERY J6 ICE (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/j6-ice/silver.jpg
- **Black**: https://www.chery.com/global/media/images/j6-ice/black.jpg
- **White**: https://www.chery.com/global/media/images/j6-ice/white.jpg
- **Grey**: https://www.chery.com/global/media/images/j6-ice/grey.jpg

## CHERY E5 BEV (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/e5-bev/silver.jpg
- **Black**: https://www.chery.com/global/media/images/e5-bev/black.jpg
- **White**: https://www.chery.com/global/media/images/e5-bev/white.jpg
- **Blue**: https://www.chery.com/global/media/images/e5-bev/blue.jpg

## CHERY E5 CSH (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/e5-csh/silver.jpg
- **Black**: https://www.chery.com/global/media/images/e5-csh/black.jpg
- **White**: https://www.chery.com/global/media/images/e5-csh/white.jpg
- **Red**: https://www.chery.com/global/media/images/e5-csh/red.jpg

## CHERY E5 ICE (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/e5-ice/silver.jpg
- **Black**: https://www.chery.com/global/media/images/e5-ice/black.jpg
- **White**: https://www.chery.com/global/media/images/e5-ice/white.jpg
- **Grey**: https://www.chery.com/global/media/images/e5-ice/grey.jpg

## CHERY C5 CSH (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/c5-csh/silver.jpg
- **Black**: https://www.chery.com/global/media/images/c5-csh/black.jpg
- **White**: https://www.chery.com/global/media/images/c5-csh/white.jpg
- **Blue**: https://www.chery.com/global/media/images/c5-csh/blue.jpg

## CHERY OMODA E5 (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/omoda-e5/silver.jpg
- **Black**: https://www.chery.com/global/media/images/omoda-e5/black.jpg
- **White**: https://www.chery.com/global/media/images/omoda-e5/white.jpg
- **Green**: https://www.chery.com/global/media/images/omoda-e5/green.jpg

## CHERY TIGGO 8 Pro Max (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/tiggo8-pro-max/silver.jpg
- **Black**: https://www.chery.com/global/media/images/tiggo8-pro-max/black.jpg
- **White**: https://www.chery.com/global/media/images/tiggo8-pro-max/white.jpg
- **Red**: https://www.chery.com/global/media/images/tiggo8-pro-max/red.jpg

## CHERY OMODA 5 GT (4 colors needed)
- **Silver**: https://www.chery.com/global/media/images/omoda-5gt/silver.jpg
- **Black**: https://www.chery.com/global/media/images/omoda-5gt/black.jpg
- **White**: https://www.chery.com/global/media/images/omoda-5gt/white.jpg
- **Yellow**: https://www.chery.com/global/media/images/omoda-5gt/yellow.jpg

## Installation Steps:

1. **Download Images**: Visit Chery Global website and download images for each car model in 4 colors
2. **Rename Files**: Rename each image to match the color name (e.g., silver.png, black.png, white.png)
3. **Place in Folders**: Put each image in the corresponding car model folder
4. **Run Database Seed**: Execute `npm run db:seed` to update database with color variants
5. **Test**: Visit any product page and click the color picker buttons

## Alternative: Use Placeholder Images

If you can't download from Chery Global, the website will work with:
- Default placeholder images from `/figma/` folder
- Color picker will still work (changes background blur effect)
- No actual car images will show for different colors until you add them

## Image Specifications:
- **Format**: PNG or JPG
- **Size**: 1200x800 pixels (minimum)
- **Background**: Transparent PNG or white background
- **Quality**: High resolution, web-optimized

## Testing:
After placing images, run:
```bash
npm run dev
```

Then visit: http://localhost:3000/models/chery-omoda-5-gt
Click the color picker buttons to see different car colors!