import { Job } from "bee-queue";
import { activeSockets } from "..";
import { depositsQueue } from "../queues/deposit.queue";
import { DepositJob } from "../types/queue.types";
import { Socket } from "socket.io";
import { ErrorConstructor, ResponseConstructor } from "ticketwing-storage-util";

export const listenDepositsEvents = () => {
  depositsQueue.on(
    "succeeded",
    (job: Job<DepositJob>, result: ResponseConstructor<undefined> | null) => {
      const socket: Socket = activeSockets.get(job.data.user_id);

      if (!socket) return;

      socket.emit("balance:get", result);
    }
  );

  depositsQueue.on("failed", (job: Job<DepositJob>, error) => {
    const socket: Socket = activeSockets.get(job.data.user_id);

    if (!socket) return;

    if (error instanceof ErrorConstructor && error.code === 100) return;

    socket.emit("balance:error", error);
  });
};
