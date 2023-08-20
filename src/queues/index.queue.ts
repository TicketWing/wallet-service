import { redisClient } from "../connections/storage.connections";
import { initDepositsQueue } from "./deposit.queue";
import { initTransactionsQueue } from "./transaction.queue";

export const settings = {
  redis: redisClient,
  removeOnSuccess: true,
  removeOnFailure: true,
};

export const initQueues = () => {
  initDepositsQueue();
  initTransactionsQueue();
};
