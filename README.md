# Daily Art Battle

Deploy your own art battle platform and showcase the talents of the artists and mint NFTs for best winning arts.

## Demo
[Demo App](https://testnet-daily-art-battle.vercel.app/)

## Deploy
[Deploy on vercel](https://vercel.com/new/clone?repository-url=https://github.com/Teckas-Technologies/daily-art-battle)

## Tooling

- **Use Case**: Link to git homepage (README.MD)
- **Tools**: 
  - `@mintbase-js/data`
  - `@mintbase-js/wallet`
  - `@mintbase-js/react`
  - `@mintbase-js/sdk`
  - `@mintbase-js/storage`
- **Framework**: Next.js 14

## Project Walkthrough

### Install dependencies
```bash
pnpm install
```

#### Run the project
```bash
pnpm dev
```
In this template we used Mintbase SDK wisely:

- We used Mintbase Wallet SDK for connecting the wallet to the application.
- We used Mintbase React SDK for frontend helper functions to call Mintbase functionalities.
- We used Mintbase SDK for minting and other blockchain transactions.
- We used Mintbase Storage SDK for storing the arts and metadata to the blockchain storage.

In this application, we have two kinds of participants:

- Artists who are creating the art and uploading it into the platform.
- Voters who are casting their votes for the artworks and giving upvotes to the next coming arts.
### Step-by-step process
#### Connect Wallet

```ts
"use client";
import { useMbWallet } from "@mintbase-js/react";

export const NearWalletConnector = () => {
  const { isConnected, selector, connect, activeAccountId } = useMbWallet();

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };
};
```
#### Upload Artwork
```ts
const uploadArtWork = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!isConnected || !activeAccountId) {
    connect();
    return;
  }
  setUploading(true);
  try {
    const artBattle: Partial<ArtData> = { artistId: activeAccountId };
    if (artworks.length < 2) {
      alert("Please Upload All files");
    }
    artBattle.arttitle = artTitle;
    
    for (const artwork of artworks) {
      if (!artwork.file) {
        alert(`Missing file for ${artwork.name}`);
        break;
      }
      const uploadResult = await uploadFile(artwork.file);
      const url = `https://arweave.net/${uploadResult.id}`;
      console.log("Media Url: ", url);
      const metadata = {
        title: "Art Battle",
        media: artwork.file
      }
      const referenceResult = await uploadReference(metadata);
      const referenceUrl = `https://arweave.net/${referenceResult.id}`;
      switch (artwork.name) {
        case 'Unique Rare':
          artBattle.colouredArt = url;
          artBattle.colouredArtReference = referenceUrl;
          break;
        case 'Participation Reward':
          artBattle.grayScale = url;
          artBattle.grayScaleReference = referenceUrl;
      }
    }
    console.log(artBattle);
    await saveData(artBattle as ArtData);
    alert('All files uploaded successfully');
    onClose();
    location.reload();
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('Failed to upload files');
  } finally {
    setUploading(false);
  }
};
```
#### Upvote
```ts
const upVote = async (id: string) => {
  if (!isConnected || !activeAccountId) {
    await connect();
    return;
  }
  if (!id) {
    alert("Art not loaded!");
    return;
  }
  console.log(id);
  const success = await submitVote({
    participantId: activeAccountId,
    artId: id,
  });
  console.log(success);
  if (success) {
    setSuccess(true);
    alert('Vote submitted successfully!');
    location.reload();
  } else {
    alert('Failed to submit vote. Maybe you already voted!');
  }
};
```
#### Vote
```ts
const onVote = async (id: string) => {
  if (!isConnected || !activeAccountId) {
    await connect();
    return;
  }
  if (!battleId) {
    alert("Battle not loaded!");
    return;
  }
  const success = await submitVote({
    participantId: activeAccountId,
    battleId: battleId,
    votedFor: id === "ArtA" ? "ArtA" : "ArtB"
  });
  if (success) {
    setSuccess(true);
    alert('Vote submitted successfully!');
  } else {
    alert('Failed to submit vote. Maybe you already voted!');
  }
};
```

#### Scheduler
```ts
const { CronJob } = require('cron');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const cronJob = new CronJob(
  '0 * * * *',
  async function() {
    try {
      const response = await fetch(`${baseUrl}/api/mintNfts`, { 
        method: 'GET'
      });

      if (response.ok) {
        console.log("API call successful");
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },
  null,
  true,
  'America/Los_Angeles'
);
cronJob.start();
```

### Environment Variables
Once everything is done, let's add the environment variables. Copy the .env-example file and paste it as .env.

Explanation of each environment variable
- SERVER_WALLET_ID - This wallet address is used to mint the NFTs in the background
- SERVER_WALLET_PK - Secret Key of the Server mint wallet
- NEXT_PUBLIC_NETWORK - This could be either testnet or mainnet.
- ART_BATTLE_CONTRACT - This NFT contract used to mint all the grayscale NFTs
- SPECIAL_WINNER_CONTRACT - This NFT contract used to mint the special and rare unique NFTs
- MONGODB_URI - Connection string of the MongoDB URL