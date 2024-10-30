    import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
    import { v4 as uuidv4 } from 'uuid';
    import { ACCOUNT_KEY,ACCOUNT_NAME,CONTAINER_NAME } from "@/config/constants";
    import { CAMPAIGN_CREATION_COST } from "@/config/points";
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

    export async function calculateCampaignCoins(startDate: any, endDate: any) {
        // Ensure startDate and endDate are Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        // Validate if both dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("Invalid date provided");
        }
      
        // Get the difference in time (milliseconds)
        const diffInMs = end.getTime() - start.getTime();
    
        // Convert milliseconds into days and add 1 to include both start and end dates
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
        // Coins to be spent: 10,000 per day
        const coinsPerDay = CAMPAIGN_CREATION_COST;
        const totalCoins = diffInDays * coinsPerDay;
      
        return totalCoins;
      }

    export default uploadMediaToAzure;
