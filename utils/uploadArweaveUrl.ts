import { uploadReference } from "@mintbase-js/storage";
export default async function uploadArweaveUrl(url: string) {
  const file = await urlToFile(url);
  const metadata = {
    title: "Art Battle",
    media: file
  }
  const referenceResult = await uploadReference(metadata);
  const referenceUrl = `https://arweave.net/${referenceResult.id}`;
  console.log(url, referenceUrl);
  return { url, referenceUrl };
}

async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  return file;
}
