// path/to/your/runProcess.js
import axios from 'axios';
import Jimp from 'jimp';
import Badge from '../public/images/badge.png';
import { uploadFile,uploadReference } from '@mintbase-js/storage';
import { BASE_URL } from '@/config/constants';
async function processImage(imageDataURL:any, losingDataURL:any, logoDataURL:any,text:any,text2:any,text3:any) {
  try {
    const [imageResponse, losingDataResponse, logoResponse] = await Promise.all([
      axios.get(imageDataURL, { responseType: 'arraybuffer' }),
      axios.get(losingDataURL, { responseType: 'arraybuffer' }),
      axios.get(logoDataURL, { responseType: 'arraybuffer' }),
    ]);

    const [originalImage, losingArtImage, logoImage] = await Promise.all([
      Jimp.read(Buffer.from(imageResponse.data)),
      Jimp.read(Buffer.from(losingDataResponse.data)),
      Jimp.read(Buffer.from(logoResponse.data)),
    ]);

    logoImage.resize(originalImage.bitmap.width, originalImage.bitmap.height);

    const losingArtWidth = 256;
    losingArtImage.resize(losingArtWidth, Jimp.AUTO);

    const shadowOffset = 3; // Small shadow offset
    const shadowBlur = 3;  // Shadow blur
    const shadowOpacity = 0.9; // Decreased initial shadow opacity

    // Create the shadow
    const shadowImage = new Jimp(
      losingArtImage.bitmap.width + shadowBlur * 2,
      losingArtImage.bitmap.height + shadowBlur * 2,
      0x00000000
    );

    shadowImage.scan(0, 0, shadowImage.bitmap.width, shadowImage.bitmap.height, function(x, y, idx) {
      const distanceToEdge = Math.min(x, y, shadowImage.bitmap.width - x, shadowImage.bitmap.height - y);
      const alpha = Math.max(0, shadowOpacity * 255 * (1 - distanceToEdge / shadowBlur));
      this.bitmap.data[idx + 3] = alpha;
    });

    shadowImage.blur(shadowBlur);

    const x = originalImage.bitmap.width - losingArtImage.bitmap.width - shadowOffset - shadowBlur - 30;
    const y = originalImage.bitmap.height - losingArtImage.bitmap.height - shadowOffset - shadowBlur - 80;

    // Composite the shadow and losing art onto the original image
    originalImage
      .composite(logoImage, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1,
      })
      .composite(shadowImage, x - shadowBlur, y - shadowBlur, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1,
      })
      .composite(losingArtImage, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 1,
        opacityDest: 1,
      });

    // Load the font (Jimp.FONT_SANS_32_BLACK for black color)
    const font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    const font2 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    // Add black text at the top center
  
    const textWidth = Jimp.measureText(font2, text);
    const textX = (originalImage.bitmap.width - textWidth) / 2;
    const textY = 10; // Padding from the top

    originalImage.print(font2, textX, textY, {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    }, textWidth);


    const text2Width = Jimp.measureText(font2, text2);
    const text2X = originalImage.bitmap.width - text2Width -30 ; // 10px margin from the right
    const text2Y = originalImage.bitmap.height-40; // 10px margin from the bottom
    originalImage.print(font2, text2X, text2Y, {
      text: text2,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    }, text2Width);

    // Add text 3 (aligned to the right bottom with margin top)
    const text3Width = Jimp.measureText(font1, text3);
    const text3X = originalImage.bitmap.width - text3Width -30 ; // 10px margin from the right
    const text3Y = originalImage.bitmap.height -70; // 60px margin from the bottom
    originalImage.print(font1, text3X, text3Y, {
      text: text3,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    }, text3Width);
    
 
    const processedImageBuffer = await originalImage.getBufferAsync(Jimp.MIME_JPEG);

    return processedImageBuffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Internal Server Error');
  }
}


export default async function runProcess(imageData:any,losingData:any,text:any,text2:any,text3:any) {
  const imageDataURL =imageData;
  const losingDataURL = losingData;
  const logoDataURL =  BASE_URL + Badge.src;
  console.log(logoDataURL)
  try {
    const processedImageBuffer = await processImage(imageDataURL, losingDataURL, logoDataURL,text,text2,text3);
    const blob = new Blob([processedImageBuffer], { type: 'image/jpeg' });
    const processedFile = new File([blob], 'processed-image.jpg', { type: 'image/jpeg' });
    const uploadResult = await uploadFile(processedFile);
    const url = `https://arweave.net/${uploadResult.id}`;

    const metadata = {
      title: 'Art Battle',
      media: processedFile,
    };

    const referenceResult = await uploadReference(metadata);
      const referenceUrl = `https://arweave.net/${referenceResult.id}`;

    console.log(url,referenceUrl)
    return {url,referenceUrl};
  } catch (error) {
    console.error('Processing error:', error);
  }
}