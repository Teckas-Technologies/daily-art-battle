export enum AdminTransactionType {
    // Received Transactions
    SPENT_FOR_BURN = 'spent_for_burn',
    SPENT_FOR_DAILY_CHECKIN = 'spent_for_daily_checkin',
    SPENT_FOR_NEAR_TRANSFER = 'spent_for_near_transfer',
    SPENT_FOR_USDT_TRANSFER = 'spent_for_usdt_transfer',
    SPENT_FOR_NEAR_AIRDROP = 'spent_for_near_airdrop',
    SPENT_FOR_TELEGRAM_AIRDROP = 'spent_for_telegram_airdrop',
    SPENT_FOR_WEEKLY_CLAIM = 'spent_for_weekly_claim',
    SPENT_FOR_REFERRAL = 'spent_for_referral',
    SPENT_FOR_SIGNUP = 'spent_for_signup',
    SPENT_FOR_SPECIAL_WINNER = 'spent_for_special_winner',
    SPENT_FOR_SPECIAL_REWARD = 'spent_for_special_reward',
    SPENT_FOR_ARTIST_RAFFLE = 'spent_for_artist_raffle',
    SPENT_FOR_WINNING_ARTIST = 'spent_for_artist_raffle',

    EARN = 'earn',
    SPENT = 'spent',

    // Spent Transactions
    RECEIVED_FROM_ART_UPLOAD = 'received_from_art_upload',
    RECEIVED_FROM_AI_IMAGE_GENERATION = 'received_from_ai_image_generation',
    RECEIVED_FROM_RAFFLE = 'received_from_raffle',
    RECEIVED_FROM_CAMPAIGN = 'received_from_campaign',
    ADDED_COINS = 'added_coins',
  }
  