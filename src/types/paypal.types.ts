export type HandledFunction<T> = (
  request: T,
  callback: CallbackFunction
) => Promise<any>;

export type PayPalConnection = {
  mode: string;
  client_id: string;
  client_secret: string;
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

