import { uploadBuffer, uploadReference } from "@mintbase-js/storage";
export default async function uploadArweaveUrl(url: string) {
  const metadata = {
    title: "Art Battle",
    media: url
  }
  const referenceResult = await uploadReference(metadata);
  const referenceUrl = `https://arweave.net/${referenceResult.id}`;
  console.log(url, referenceUrl);
  return { url, referenceUrl };
}

// import { uploadBuffer } from "@mintbase-js/storage";
// export default async function uploadArweaveUrl(url: string) {
//     const metadata = {
//       title: "Art Battle",
//       media: url,
//     };

//     const referenceBuffer = Buffer.from(JSON.stringify(metadata));
//     const referenceResult = await uploadBuffer(referenceBuffer,"application/json","File");
//     const referenceUrl = `https://arweave.net/${referenceResult.id}`;
//     console.log(url,referenceUrl);
//     return {url,referenceUrl};
// }