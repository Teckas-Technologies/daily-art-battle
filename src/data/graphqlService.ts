import { nearEndpoints } from "./network";
import { NEXT_PUBLIC_NETWORK } from "@/config/constants";
export type GqlFetchResult<T> = {
  data?: T;
  error?: unknown;
};
export const graphQLService = async ({
    query,
    variables,
    network,
  }: {
    query: string;
    variables?: Record<string, unknown>;
    network?: "testnet" | "mainnet";
  }) => {
    try {
      const data = await graphQlFetch(query, variables, network).then(
        async (data: Response) => {
          const res = await data.json();
          return res.data;
        }   
      );
  
      return { data };
    } catch (error) {
      console.log(error, "error");
      return { error: `Query Error: ${error}` };
    }
  };
  
  export const graphQlFetch = async (
    query: string,
    variables?: Record<string, unknown>,
    network?: "testnet" | "mainnet"
  ): Promise<Response> => {
    const net = network ?? NEXT_PUBLIC_NETWORK;
    const isTestnet = net === "testnet";
  
    const baseUrl = isTestnet
      ? nearEndpoints.testnet.graph
      : nearEndpoints.mainnet.graph;
  
    const res = fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
      headers: {
        "content-type": "application/json",
        "mb-api-key": "omni-site",
      },
    });
  
    return await res;
  };