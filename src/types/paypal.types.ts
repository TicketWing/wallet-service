export type HandledFunction<T> = (
  request: T,
  callback: CallbackFunction
) => Promise<any>;

export type PayPalConnection = {
  mode: string;
  client_id: string;
  client_secret: string;
};

export type DepositTransaction = {
  amount: {
    total: number;
    currency: string;
  };
};

export type WithdrawAmount = {
  total: number;
  currency: string;
};

export type CallbackFunction = (error: any, response: any) => void;

export type PromisifiedFunction<T> = (
  request: T,
  callback: CallbackFunction
) => Promise<any>;

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
