declare namespace TelegramWebApp {
    interface User {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
      photo_url?: string;
    }
  
    interface InitDataUnsafe {
      user?: User;
      query_id?: string;
      auth_date?: number;
      hash?: string;
    }
  
    interface WebApp {
      initData: string;
      initDataUnsafe: InitDataUnsafe;
      ready: () => void;
      close: () => void;
    }
  }
  
  declare const Telegram: {
    WebApp: TelegramWebApp.WebApp;
  };
  