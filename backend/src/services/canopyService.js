// // src/services/canopyService.js
// const Jimp = require('jimp');

// /**
//  * compute canopy fraction using VARI on a resized image for speed
//  * returns { canopyFraction: number (0..1) }
//  */
// async function computeCanopyFraction(imagePath, options = {}) {
//   const threshold = parseFloat(process.env.CANOPY_VARI_THRESHOLD || '0.2');
//   const PROC_WIDTH = options.width || 256;

//   const img = await Jimp.read(imagePath);
//   const W = PROC_WIDTH;
//   const H = Math.round(img.bitmap.height * (W / img.bitmap.width));
//   img.resize(W, H);

//   const data = img.bitmap.data;
//   let canopyCount = 0;
//   let total = W * H;

//   for (let y = 0; y < H; y++) {
//     for (let x = 0; x < W; x++) {
//       const idx = (W * y + x) * 4;
//       const r = data[idx + 0];
//       const g = data[idx + 1];
//       const b = data[idx + 2];
//       const denom = (g + r - b);
//       let vari = 0;
//       if (Math.abs(denom) > 1e-6) vari = (g - r) / denom;
//       if (isFinite(vari) && vari > threshold) canopyCount++;
//     }
//   }

//   return { canopyFraction: canopyCount / total };
// }

// module.exports = { computeCanopyFraction };
