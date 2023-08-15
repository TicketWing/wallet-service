import Queue from "bee-queue";
import { redisClient } from "../connections/storage.connections";


const settings = {
  redis: redisClient,
  removeOnSuccess: true,
  removeOnFailure: true,
};

export const depositsQueue = new Queue("transactions", settings);


depositsQueue.process(async (deposit: any) => {
  
});
