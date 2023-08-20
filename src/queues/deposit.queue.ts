import Queue, { Job } from "bee-queue";
import { PayPalService } from "../services/paypal.service";
import { ErrorConstructor, ResponseConstructor } from "ticketwing-storage-util";
import { BalanceService } from "../services/balance.service";
import { DepositJob } from "../types/queue.types";
import { settings } from "./index.queue";

const payPalService = new PayPalService();
const balanceService = new BalanceService();
export const depositsQueue = new Queue("transactions", settings);

export const initDepositsQueue = () => {
  return depositsQueue.process(async (job: Job<DepositJob>) => {
    const { transactionId, user_id } = job.data;

    const deposit: any = await payPalService.getDetails(transactionId);
    const { status } = deposit;

    if (status === "pending" || "approved") {
      await job.retries(job.options.retries + 1).save();
      throw new ErrorConstructor("Deposit", "Pending", 100);
    }

    if (status === "completed") {
      const balance = await balanceService.get(user_id);
      const depositAmount = deposit.transactions[0].amount.total;
      const updatedBalance = balance + depositAmount;
      await balanceService.update(user_id, updatedBalance);
      const result = { balance: updatedBalance };
      return result;
    }

    if (status === "canceled" || "voided") {
      throw new ErrorConstructor("Deposit", "Transaction is canceled", 101);
    }

    if (status === "failed" || "expired") {
      throw new ErrorConstructor("Deposit", "Transaction is failed", 102);
    }
  });
};
