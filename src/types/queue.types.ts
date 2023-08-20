export type DepositJob = {
  transactionId: string;
  user_id: string;
};

export type TransactionJob = {
  id: string;
  user_id: string;
  amount: string;
}