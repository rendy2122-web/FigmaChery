/**
 * The /figma/<folder>/ product-shoot assets were pulled from several
 * different sources over time and don't share one consistent file
 * extension per car — some are .png, others .webp or .jpg. Code that
 * hardcoded ".png" for every car silently 404'd on the others. This is
 * the single source of truth for both the folder name and the real
 * extension per asset type, shared between the server-side data layer
 * (cars.ts) and the client-side features grid.
 */

const FOLDER_NAME_BY_SLUG: Record<string, string> = {
  "chery-q": "chery q",
  "chery-e5": "chery e5",
  "chery-j6": "J6",
  "chery-c5-csh": "chery c5 csh",
  "chery-c5": "chery c5",
  "omoda-5-gt": "Omoda 5 GT",
  "tiggo-9-csh": "tiggo 9 csh",
  "tiggo-cross-csh": "tiggo cross csh",
  "tiggo-8-csh": "tiggo 8 csh",
  "tiggo-cross-sport": "tiggo cross sport",
  "tiggo-cross": "tiggo cross",
  "tiggo-8": "tiggo 8",
  "tiggo-8-pro-max": "tiggo 8 pro max",
};

interface AssetExtensions {
  interior: string;
  exterior: string;
  car: string;
  feature: string;
}

const ASSET_EXTENSIONS_BY_SLUG: Record<string, AssetExtensions> = {
  "chery-q": { interior: "png", exterior: "webp", car: "png", feature: "webp" },
  "chery-e5": { interior: "webp", exterior: "webp", car: "png", feature: "jpg" },
  "chery-j6": { interior: "webp", exterior: "webp", car: "png", feature: "png" },
  "chery-c5-csh": { interior: "webp", exterior: "webp", car: "webp", feature: "webp" },
  "chery-c5": { interior: "png", exterior: "jpg", car: "png", feature: "jpg" },
  "omoda-5-gt": { interior: "webp", exterior: "webp", car: "webp", feature: "webp" },
  "tiggo-9-csh": { interior: "png", exterior: "png", car: "png", feature: "jpg" },
  "tiggo-cross-csh": { interior: "png", exterior: "png", car: "png", feature: "png" },
  "tiggo-8-csh": { interior: "webp", exterior: "webp", car: "webp", feature: "webp" },
  "tiggo-cross-sport": { interior: "png", exterior: "png", car: "png", feature: "png" },
  "tiggo-cross": { interior: "webp", exterior: "webp", car: "webp", feature: "webp" },
  "tiggo-8": { interior: "png", exterior: "png", car: "png", feature: "png" },
  "tiggo-8-pro-max": { interior: "png", exterior: "png", car: "webp", feature: "png" },
};

const DEFAULT_EXTENSIONS: AssetExtensions = {
  interior: "png",
  exterior: "png",
  car: "png",
  feature: "png",
};

export function getCarFolderName(slug: string): string {
  return FOLDER_NAME_BY_SLUG[slug] ?? slug.replace(/-/g, " ");
}

export function getCarImagePaths(slug: string) {
  const folderName = getCarFolderName(slug);
  const ext = ASSET_EXTENSIONS_BY_SLUG[slug] ?? DEFAULT_EXTENSIONS;

  return {
    folderName,
    hero: `/figma/${folderName}/hero.png`,
    interior: `/figma/${folderName}/interior.${ext.interior}`,
    exterior: `/figma/${folderName}/exterior.${ext.exterior}`,
    car: `/figma/${folderName}/car.${ext.car}`,
    feature: `/figma/${folderName}/feature.${ext.feature}`,
    video: `/figma/${folderName}/video.mp4`,
  };
}
