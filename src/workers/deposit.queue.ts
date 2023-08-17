import Queue, { Job } from "bee-queue";
import { redisClient } from "../connections/storage.connections";
import { PayPalService } from "../services/paypal.service";
import { ErrorConstructor } from "ticketwing-storage-util";
import { BalanceService } from "../services/balance.service";
import { DepositJob } from "../types/queue.types";

const settings = {
  redis: redisClient,
  removeOnSuccess: true,
  removeOnFailure: true,
};

const payPalService = new PayPalService();
const balanceService = new BalanceService();
export const depositsQueue = new Queue("transactions", settings);

depositsQueue.process(async (job: Job<DepositJob>) => {
  const { transactionId, user_id } = job.data;
  const errorName = "Transaction Queue";

  try {
    const deposit: any = await payPalService.getDetails(transactionId);
    const { status } = deposit;
    if (status === "pending" || "approved") {
      job.retries(10);
    }

    if (status === "completed") {
      const balance = await balanceService.get(user_id);
      const depositAmount = deposit.transactions[0].amount.total;
      const updatedBalance = balance + depositAmount;
      await balanceService.update(user_id, updatedBalance);
    }

    if (status === "canceled" || "voided") {
      throw new ErrorConstructor(errorName, "Transaction is canceled", 501);
    }

    if (status === "failed" || "expired") {
      throw new ErrorConstructor(errorName, "Transaction is failed", 501);
    }
  } catch (error: any) {
    throw new ErrorConstructor("Transaction", error.message, 501);
  }
});
