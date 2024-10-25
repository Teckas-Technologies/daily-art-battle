const axios = require('axios');
export default async function spinnerWithEmoji(artAcolouredArt:string,artBcolouredArt:string) {

  try {
    // Fetch images from Arweave URLs
    const [imageAResponse, imageBResponse] = await Promise.all([
      axios.get(artAcolouredArt, { responseType: 'arraybuffer' }),
      axios.get(artBcolouredArt, { responseType: 'arraybuffer' })
    ]);

    const imageA = Buffer.from(imageAResponse.data).toString('base64');
    const imageB = Buffer.from(imageBResponse.data).toString('base64');

    // Send POST request to Flask API to generate GIF
    const response = await axios.post('https://spinner-cscbetbtbfepcrdc.canadacentral-01.azurewebsites.net/api/generate_gif', {
      image1: imageA,
      image2: imageB,
      transition_type: 'rotate'
    });
    console.log("Res:",response);
    return response?.data;

  } catch (error) {
    console.log("error", error);
  }
}
    