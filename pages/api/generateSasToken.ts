// pages/api/generateSasToken.ts

import { StorageSharedKeyCredential, BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import { ACCOUNT_KEY, ACCOUNT_NAME, CONTAINER_NAME } from "@/config/constants";
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from "next";

const generateSasToken = async (req: NextApiRequest, res: NextApiResponse) => {
    const accountName = ACCOUNT_NAME;
    const accountKey = ACCOUNT_KEY;
    const containerName = CONTAINER_NAME;

    if (!accountName || !accountKey) {
        return res.status(500).json({ error: "Azure storage credentials are not configured." });
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const blobName = `${uuidv4()}.tmp`;  // Temporary blob name

    const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("cwr"), // Create, Write, Read
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expires in 1 hour
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    res.status(200).json({ blobUrl });
};

export default generateSasToken;
