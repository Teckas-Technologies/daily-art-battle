export enum TransactionType {
    // Received Transactions
    RECEIVED_FROM_BURN = 'received_from_burn',
    RECEIVED_FROM_DAILY_CHECKIN = 'received_from_daily_checkin',
    RECEIVED_FROM_NEAR_TRANSFER = 'received_from_near_transfer',
    RECEIVED_FROM_USDT_TRANSFER = 'received_from_usdt_transfer',
    RECEIVED_FROM_NEAR_AIRDROP = 'received_from_near_airdrop',
    RECEIVED_FROM_TELEGRAM_AIRDROP = 'received_from_telegram_airdrop',
    RECEIVED_FROM_WEEKLY_CLAIM = 'received_from_weekly_claim',
    RECEIVED_FROM_REFERRAL = 'received_from_referral',
    RECEIVED_FROM_SIGNUP = 'received_from_signup',
    RECEIVED_FROM_SPECIAL_WINNER = 'received_from_special_winner',
    RECEIVED_FROM_SPECIAL_REWARD = 'received_from_special_reward',

    // Spent Transactions
    SPENT_FOR_ART_UPLOAD = 'spent_for_art_upload',
    SPENT_FOR_AI_IMAGE_GENERATION = 'spent_for_ai_image_generation',
    SPENT_FOR_RAFFLE = 'spent_for_raffle',
    SPENT_FOR_CAMPAIGN = 'spent_for_campaign',

  }
  