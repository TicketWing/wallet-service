import { transactionsQueue } from "./transaction.queue";

export const processingTransactions = () => {
  transactionsQueue.on("job succeeded", () => {});
  transactionsQueue.on("job failed", () => {});
  transactionsQueue.on("error", () => {});
};
