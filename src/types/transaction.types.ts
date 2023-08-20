export type DepositData = {
    amount: string;
    currency: string;
  };
  
export type TransactionData = {
    amount: string;
    description: string;
    currency: string;
  };
  
export type TransactionStatus = "success" | "error" | "pending" | "canceled";