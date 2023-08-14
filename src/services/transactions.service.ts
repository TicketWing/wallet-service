import { CacheableStorage } from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage.connections";

type PaymentDetails = {
  description: string;
  amount: string;
};

class TransactionService {
  private table = "transactions";
  private storage: CacheableStorage;

  constructor() {
    this.storage = new CacheableStorage(databasePool, redisClient, this.table);
  }

  async create(user_id: string) {}
}
