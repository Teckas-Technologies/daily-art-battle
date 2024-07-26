import Battle from "../model/Battle";
const axios = require('axios');
import { connectToDatabase } from "./mongoose";
import { uploadBuffer } from "@mintbase-js/storage";
export default async function spinner() {
  await connectToDatabase();
  const battle = await Battle.findOne({
    isNftMinted: false,
    isBattleEnded: true
  });

  if (!battle) {
    console.log("No battle found");
    return;
  }

  try {
    // Fetch images from Arweave URLs
    const [imageAResponse, imageBResponse] = await Promise.all([
      axios.get(battle.artAcolouredArt, { responseType: 'arraybuffer' }),
      axios.get(battle.artBcolouredArt, { responseType: 'arraybuffer' })
    ]);

    const imageA = Buffer.from(imageAResponse.data).toString('base64');
    const imageB = Buffer.from(imageBResponse.data).toString('base64');

    // Send POST request to Flask API to generate GIF
    const response = await axios.post('http://127.0.0.1:5000/api/generate_gif', {
      image1: imageA,
      image2: imageB,
      transition_type: 'rotate'
    });

    

    const base64Gif = response.data.gif;

    return base64Gif;

  } catch (error) {
    console.log("error", error);
  }
}
    