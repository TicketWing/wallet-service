export type HandledFunction<T> = (
  ...args: any[]
) => Promise<any>;

export type PayPalConnection = {
  mode: string;
  client_id: string;
  client_secret: string;
};

export type ApprovalData = {
  PayerID: string;
  paymentId: string;
};

export type TransactionStates = {
  success: string[];
  error: string[];
};
