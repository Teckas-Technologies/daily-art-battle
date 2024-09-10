import { uploadBuffer } from "@mintbase-js/storage";
export default async function uploadArweaveUrl(url: string) {
    const metadata = {
      title: "Art Battle",
      media: url,
    };

    const referenceBuffer = Buffer.from(JSON.stringify(metadata));
    console.log("referenceBuffer >> ", referenceBuffer)
    const referenceResult = await uploadBuffer(referenceBuffer,"application/json","File");
    const referenceUrl = `https://arweave.net/${referenceResult.id}`;
    console.log(url,referenceUrl);
    return {url,referenceUrl};
}