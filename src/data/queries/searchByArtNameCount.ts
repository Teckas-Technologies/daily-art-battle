import { gql } from 'graphql-request';

export const SEARCH_TOTAL = gql`
  query MyQuery($nft_contract_ids: [String!], $owner: String!, $title: String!) {
    mb_views_nft_tokens_aggregate(
      where: {
        nft_contract_id: { _in: $nft_contract_ids }
        owner: { _eq: $owner }
        title: { _iregex: $title }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
