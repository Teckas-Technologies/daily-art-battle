import { gql } from 'graphql-request';

export const SEARCH_ARTNAME = gql`
  query SearchArtName(
    $nft_contract_id: String!, 
    $owner: String, 
    $title: String, 
    $limit: Int, 
    $offset: Int
  ) {
    mb_views_nft_tokens(
      where: {
        nft_contract_id: { _eq: $nft_contract_id },
        owner: { _eq: $owner },
        title: { _iregex: $title }
      },
      limit: $limit,
      offset: $offset
    ) {
      base_uri
      burned_receipt_id
      burned_timestamp
      copies
      description
      expires_at
      extra
      issued_at
      last_transfer_receipt_id
      last_transfer_timestamp
      media
      media_hash
      metadata_content_flag
      metadata_id
      mint_memo
      minted_receipt_id
      minted_timestamp
      minter
      nft_contract_content_flag
      nft_contract_created_at
      nft_contract_icon
      nft_contract_id
      nft_contract_is_mintbase
      nft_contract_name
      nft_contract_owner_id
      nft_contract_reference
      nft_contract_spec
      nft_contract_symbol
      owner
      reference
      reference_blob
      reference_hash
      royalties
      royalties_percent
      splits
      starts_at
      title
      token_id
      updated_at
    }
  }
`;
