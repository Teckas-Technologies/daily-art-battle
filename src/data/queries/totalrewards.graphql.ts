import { gql } from 'graphql-request';

export const TOTAL_REWARDS = gql`
  query MyQuery($nft_contract_ids: [String!], $owner: String!) {
    mb_views_nft_tokens_aggregate(where: {nft_contract_id: {_in: $nft_contract_ids}, owner: {_eq: $owner}}) {
      aggregate {
        count
      }
    }
  }
`;
