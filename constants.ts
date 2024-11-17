import { NetworkId } from '@/data/types';
require("dotenv").config();

const appName: string = process.env.NEXT_PUBLIC_APP_TITLE || "MINTBASE";
const network = (process.env.NEXT_PUBLIC_NETWORK || "mainnet") as NetworkId;
const proxyContractAddress =
  process.env.NEXT_PUBLIC_PROXY_MINTER_CONTRACT_ADDRESS ||
  "0.drop.proxy.mintbase.near";
const legacyProxyAddresses =
  process.env.NEXT_PUBLIC_LEGACY_PROXY_ADDRESSES?.split(",") || [];
const tokenContractAddress =
  process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "moments.mintbase1.near";

const mintbaseBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://mintbase.xyz";

const mintbaseWalletUrl =
  process.env.NEXT_PUBLIC_MINTBASE_WALLET_URL || "https://wallet.mintbase.xyz";

const twitterText =
  process.env.NEXT_PUBLIC_TWITTER ||
  "Exploring%20unforgettable%20moments%20at%20%23Mintbase%20%40Mintbase%20%40NEARProtocol%20%23BOS%20%23NEAR%0aMint%20yours%20here%3A%20https%3A%2F%2Fminsta.mintbase.xyz";

const adminId = process.env.ADMIN_ID || ["fungible_rhmor.testnet", "exact_spikespiegel.testnet", "minsta.testnet", "chloe.mintbus.near"];

const SOCIAL_DB_CONTRACT_ID = process.env.SOCIAL_DB_CONTRACT_ID || "social.near";
const CONTRACT_ID = "v1.social08.testnet"

export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK || "mainnet") as NetworkId;

const creditAmount = parseFloat(process.env.CREDIT_AMOUNT ?? "0.05");

const receiverId = process.env.RECEIVER_ID || "minstaorg.near";

export const constants = {
  receiverId,
  creditAmount,
  SOCIAL_DB_CONTRACT_ID,
  CONTRACT_ID,
  NETWORK,
  adminId,
  appName,
  proxyContractAddress,
  legacyProxyAddresses,
  tokenContractAddress,
  network,
  mintbaseBaseUrl,
  mintbaseWalletUrl,
  twitterText,
  isClosed: process.env.NEXT_PUBLIC_MINTING_CLOSED === "true" || false,
  showRewards: process.env.NEXT_PUBLIC_SHOW_REWARDS === "true" || false,
};
