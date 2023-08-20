import Queue, { Job } from "bee-queue";
import { BalanceService } from "../services/balance.service";
import { TransactionService } from "../services/transactions.service";
import { TransactionJob } from "../types/queue.types";
import { ErrorConstructor, ResponseConstructor } from "ticketwing-storage-util";
import { settings } from "./index.queue";

export const transactionsQueue = new Queue("transactions", settings);

const balanceService = new BalanceService();
const transactionService = new TransactionService();

export const initTransactionsQueue = () => {
 return transactionsQueue.process(async (job: Job<TransactionJob>) => {
    const { id, user_id, amount } = job.data;

    const difference = await balanceService.differ(user_id, amount);

    if (difference === null) {
      await transactionService.setStatus(id, "error");
      throw new ErrorConstructor("Transaction", "Not enough money!", 103);
    }

    const stringifiedDifference = String(difference);
    await balanceService.set(user_id, stringifiedDifference);
    await transactionService.setStatus(id, "success");
    const balance = await balanceService.get(user_id);
    const result = { balance };
    return result;
  });
};
