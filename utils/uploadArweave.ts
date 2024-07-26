import { connectToDatabase } from "./mongoose";
import { uploadFile, uploadReference,uploadBuffer } from "@mintbase-js/storage";
export default async function uploadArweave(base64:any) {
    const inputBuffer = Buffer.from(base64, 'base64');

    const blob = new Blob([inputBuffer], { type: "image/jpeg" });

    const processedFile = new File([blob], "processed-image.jpg", {
      type: "image/jpeg",
    });

   
    const uploadResult = await uploadBuffer(inputBuffer,"image/gif","File");
    const url = `https://arweave.net/${uploadResult.id}`;
    const metadata = {
      title: "Art Battle",
      media: url,
    };

    const referenceBuffer = Buffer.from(JSON.stringify(metadata));
    const referenceResult = await uploadBuffer(referenceBuffer,"application/json","File");
    const referenceUrl = `https://arweave.net/${referenceResult.id}`;
    console.log(url,referenceUrl);
    return {url,referenceUrl};
}