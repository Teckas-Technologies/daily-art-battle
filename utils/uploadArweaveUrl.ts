import { uploadBuffer } from "@mintbase-js/storage";
export default async function uploadArweaveUrl(urlI: string) {
  try {
    const base64 = await convertToBase64(urlI as string);
    const inputBuffer = Buffer.from(base64, 'base64');

    const uploadResult = await uploadBuffer(inputBuffer, "image/gif", "File");
    const url = `https://arweave.net/${uploadResult.id}`;
    const metadata = {
      title: "Art Battle",
      media: url,
    };

    const referenceBuffer = Buffer.from(JSON.stringify(metadata));
    const referenceResult = await uploadBuffer(referenceBuffer, "application/json", "File");
    const referenceUrl = `https://arweave.net/${referenceResult.id}`;
    console.log(url, referenceUrl);
    return { url, referenceUrl };
  } catch (error) {
    console.error('Error during Arweave upload:', error);
    throw error;
  }
}

async function convertToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');
    return base64String;
  } catch (error) {
    console.error('Error converting URL to Base64:', error);
    throw error;
  }
}
