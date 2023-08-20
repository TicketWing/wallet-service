import { Job } from "bee-queue";
import { transactionsQueue } from "../queues/transaction.queue";
import { TransactionJob } from "../types/queue.types";
import { activeSockets } from "..";
import { Socket } from "socket.io";

export const listenTransactionsEvents = () => {
  transactionsQueue.on("succeeded", (job: Job<TransactionJob>, result) => {
    const socket: Socket = activeSockets.get(job.data.user_id);

    if (!socket) return;

    socket.emit("balance:get", result);
  });

  transactionsQueue.on("failed", (job: Job<TransactionJob>, error) => {
    const socket: Socket = activeSockets.get(job.data.user_id);

    if (!socket) return;

    socket.emit("transaction:error", error);
  });
};
