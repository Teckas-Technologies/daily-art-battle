const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
import Jimp from "jimp";
import Badge from "../public/images/badge.png";
import { uploadFile, uploadReference } from "@mintbase-js/storage";
import { BASE_URL } from "@/config/constants";
import { connectToDatabase } from "./mongoose";
import Battle from "../model/Battle";
async function processImage(imageDataURL:any, losingDataURL:any, logoDataURL:any, text:any, text1:any, text2:any, text3:any) {
  try {
    const [imageResponse, losingDataResponse, logoResponse] = await Promise.all([
      axios.get(imageDataURL, { responseType: 'arraybuffer' }),
      axios.get(losingDataURL, { responseType: 'arraybuffer' }),
      axios.get(logoDataURL, { responseType: 'arraybuffer' })
    ]);

    const [originalImage, losingArtImage, logoImage] = await Promise.all([
      loadImage(Buffer.from(imageResponse.data)),
      loadImage(Buffer.from(losingDataResponse.data)),
      loadImage(Buffer.from(logoResponse.data))
    ]);

    const canvas = createCanvas(originalImage.width, originalImage.height);
    const ctx = canvas.getContext('2d');

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Resize and draw logo image
    ctx.drawImage(logoImage, 0, 0, originalImage.width, originalImage.height);

    // Resize and draw losing art image
    const losingArtWidth = 366;
    const losingArtHeight = 266;
    ctx.drawImage(losingArtImage, originalImage.width - losingArtWidth - 30, originalImage.height - losingArtHeight - 80, losingArtWidth, losingArtHeight);

    // Add shadow to losing art image
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.drawImage(losingArtImage, originalImage.width - losingArtWidth - 30, originalImage.height - losingArtHeight - 80, losingArtWidth, losingArtHeight);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Add text 1 (bottom right of losing art image)
    ctx.font = '26px Arial';
    ctx.fillStyle = 'purple';
    const text1Width = ctx.measureText(text1).width;
    ctx.fillText(text1, originalImage.width - text1Width - 40, originalImage.height - 90);

    // Add main text (top center)
    ctx.font = '38px Arial';
    ctx.fillStyle = 'white';
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (originalImage.width - textWidth) / 2, 40);

    // Add text 2 (bottom right)
    ctx.font = '26px Arial';
    ctx.fillStyle = 'white';
    const text2Width = ctx.measureText(text2).width;
    ctx.fillText(text2, originalImage.width - text2Width - 30, originalImage.height - 20);

    // Add text 3 (bottom right with margin top)
    ctx.font = '26px Arial';
    ctx.fillStyle = 'purple';
    const text3Width = ctx.measureText(text3).width;
    ctx.fillText(text3, originalImage.width - text3Width - 30, originalImage.height - 50);

    // Get buffer from canvas
    const processedImageBuffer = canvas.toBuffer('image/jpeg');

    return processedImageBuffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Internal Server Error');
  }
}
export default async function testrunProcess() {
    await connectToDatabase();
    const battle = await Battle.findOne({
      isNftMinted: false,
      isBattleEnded: true
  });
  
  console.log(battle)
    if (battle) {
     
        const logoDataURL = BASE_URL + Badge.src;
        console.log(logoDataURL);
        try {
          let processedImageBuffer;
          if (battle.winningArt === "Art A") {
            processedImageBuffer = await processImage(
              battle.artAcolouredArt,
              battle.artBcolouredArt,
              logoDataURL,
              battle.artAtitle,
              battle.artBtitle,
              battle.artAartistId,
              battle.artBartistId
            );
          } else if (battle.winningArt === "Art B") {
            processedImageBuffer = await processImage(
              battle.artBcolouredArt,
              battle.artAcolouredArt,
              logoDataURL,
              battle.artBtitle,
              battle.artAtitle,
              battle.artBartistId,
              battle.artAartistId
            );
          }
          console.log(processedImageBuffer)
          if (processedImageBuffer && Buffer.isBuffer(processedImageBuffer)) {
            const blob = new Blob([processedImageBuffer], { type: "image/jpeg" });
  
            const processedFile = new File([blob], "processed-image.jpg", {
              type: "image/jpeg",
            });
            const uploadResult = await uploadFile(processedFile);
            const url = `https://arweave.net/${uploadResult.id}`;
  
            const metadata = {
              title: "Art Battle",
              media: processedFile,
            };
  
            const referenceResult = await uploadReference(metadata);
            const referenceUrl = `https://arweave.net/${referenceResult.id}`;
  
            console.log(url, referenceUrl);
            battle.grayScale = url;
            battle.grayScaleReference = referenceUrl;
            const res =  await battle.save();
            console.log("saved",res);
            return { url, referenceUrl };
          }
        } catch (error) {
          console.error("Processing error:", error);
        }
      
    }
  }
  

