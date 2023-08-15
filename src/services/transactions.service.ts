import {
  CacheableStorage,
  ErrorConstructor,
  GetDBOptions,
  InsertDBOptions,
  StorageRequestBuilder,
  UpdateDBOptions,
} from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage.connections";

type TransactionData = {
  amount: string;
  description: string;
};

type TransactionStatus = "success" | "error" | "pending" | "canceled";

export class TransactionService {
  private table = "transactions";
  private storage: CacheableStorage;

  constructor() {
    this.storage = new CacheableStorage(databasePool, redisClient, this.table);
  }

  async getDetails(id: string) {
    const dbQueries: GetDBOptions = {
      where: { id },
      select: ["status", "amount", "description", "date"],
    };

    const queries = new StorageRequestBuilder<GetDBOptions, undefined>(
      dbQueries
    ).build();

    const details = await this.storage.get(queries);
    return details;
  }

  async setStatus(id: string, status: TransactionStatus) {
    const updations = { status };
    const dbQueries: UpdateDBOptions = { where: { id } };

    const queries = new StorageRequestBuilder<UpdateDBOptions, undefined>(
      dbQueries
    ).build();

    await this.storage.update(updations, queries);
  }

  async purchase(user_id: string, target: TransactionData) {
    const transaction = { user_id, ...target };
    const dbQueries = { returning: [] };

    const queries = new StorageRequestBuilder<InsertDBOptions, undefined>(
      dbQueries
    ).build();

    await this.storage.insert(transaction, queries);
  }

  async cancel(id: string) {
    const details = await this.getDetails(id);

    if (details.status !== "pending") {
      throw new ErrorConstructor(
        "Transaction",
        "This transaction is finished",
        501
      );
    }

    await this.setStatus(id, "canceled");
  }
}
