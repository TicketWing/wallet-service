export type HandledFunction<T> = (
  request: T,
  callback: CallbackFunction
) => Promise<any>;

export type PayPalConnection = {
  mode: string;
  client_id: string;
  client_secret: string;
};

// Deposit types

export type PaymentItem = {
  name: string;
  sku: string;
  price: string;
  currency: string;
  quantity: number;
};

export type PaymentTransaction = {
  item_list: {
    items: PaymentItem[];
  };
  amount: {
    currency: string;
    total: string;
  };
  description: string;
};

// Withdraw types

export type WithdrawAmount = {
  total: number;
  currency: string;
};

export type CallbackFunction = (error: any, response: any) => void;

export type ApprovalData = {
  PayerID: string;
  paymentId: string;
};

export type TransactionStates = {
  success: string[];
  error: string[];
};

export type PaymentInstance = any;

export type PayoutInstance = any;
