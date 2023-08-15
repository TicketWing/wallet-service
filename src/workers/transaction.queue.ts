import Queue from "bee-queue";
import { redisClient } from "../connections/storage.connections";
import { BalanceService } from "../services/balance.service";
import { TransactionService } from "../services/transactions.service";

const settings = {
  redis: redisClient,
  removeOnSuccess: true,
  removeOnFailure: true,
};

export const transactionsQueue = new Queue("transactions", settings);

const balanceService = new BalanceService();
const transactionService = new TransactionService();

transactionsQueue.process(async (transaction: any) => {
  const { id, user_id, amount } = transaction;

  const difference = await balanceService.differ(user_id, amount);

  if (difference === null) {
    await transactionService.setStatus(id, "error");
    return;
  }

  const stringifiedDifference = String(difference);
  await balanceService.set(user_id, stringifiedDifference);
  await transactionService.setStatus(id, "success");
});
