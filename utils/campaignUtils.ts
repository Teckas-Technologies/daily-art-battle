import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';
import { ACCOUNT_KEY,ACCOUNT_NAME,CONTAINER_NAME } from "@/config/constants";
const uploadMediaToAzure = async (base64Media: string, fileName: string): Promise<string> => {
    const accountName = ACCOUNT_NAME;
    const accountKey = ACCOUNT_KEY;
    const containerName = CONTAINER_NAME; // Replace with your container name
  
    if (!accountName || !accountKey) {
        throw new Error("Azure storage credentials are not configured.");
    }
  
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );
  
    const containerClient = blobServiceClient.getContainerClient(containerName);
  
    // Extract MIME type from base64 header
    const mimeType = base64Media.match(/^data:(.*?);base64/)?.[1];
  
    if (!mimeType) {
        throw new Error("Could not determine the MIME type from the base64 string.");
    }
  
    // Get the correct file extension based on the MIME type
    const extension = mimeType.split('/')[1]; // e.g., "png" for "image/png"
  
    // Remove the base64 header from the string
    const base64Data = base64Media.replace(/^data:(.*?);base64,/, "");
  
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");
  
    // Create a unique blob name with the correct file extension
    const blobName = `${uuidv4()}.${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  
    console.log(mimeType);
    // Upload data to the blob with correct MIME type
    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimeType },
    });
  
    // Return the URL of the uploaded media
    return blockBlobClient.url;
};

export default uploadMediaToAzure;
