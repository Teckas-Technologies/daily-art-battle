import { gql } from 'graphql-request';


export const ACCOUNT_DATE = gql`
  query gfxvs($account_id: String!) {
     accounts(where: {account_id: {_eq: $account_id}}) {
    created_at
  }
  }
`;
