import {
  CacheableStorage,
  GetCacheOptions,
  GetDBOptions,
  InsertCacheOptions,
  InsertDBOptions,
  StorageRequestBuilder,
  UpdateCacheOptions,
  UpdateDBOptions,
} from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage.connections";

export class BalanceService {
  private table = "balances";
  private storage: CacheableStorage;

  constructor() {
    this.storage = new CacheableStorage(databasePool, redisClient, this.table);
  }

  async set(user_id: string, amount: string) {
    const inserting = { user_id, amount };
    const dbQueries = { returning: ["user_id"] };
    const cacheQueries = { keyField: "user_id", cachedFields: ["amount"] };

    const queries = new StorageRequestBuilder<
      InsertDBOptions,
      InsertCacheOptions
    >(dbQueries)
      .setCacheOptions(cacheQueries)
      .build();

    await this.storage.insert(inserting, queries);
  }

  async get(user_id: string) {
    const dbQueries = { where: { user_id }, select: ["amount"] };
    const cacheQueries = { cacheKey: user_id, cachedFields: ["amount"] };

    const queries = new StorageRequestBuilder<GetDBOptions, GetCacheOptions>(
      dbQueries
    )
      .setCacheOptions(cacheQueries)
      .build();

    const balance = await this.storage.get(queries);
    return balance;
  }

  async update(user_id: string, amount: string) {
    const updating = { user_id, amount };
    const dbQueries: UpdateDBOptions = { where: { user_id } };
    const cacheQueries: UpdateCacheOptions = {
      cacheKey: user_id,
      updatingFields: ["amount"],
    };

    const queries = new StorageRequestBuilder<
      UpdateDBOptions,
      UpdateCacheOptions
    >(dbQueries)
      .setCacheOptions(cacheQueries)
      .build();

    await this.storage.update(updating, queries);
  }

  async differ(user_id: string, amount: string): Promise<number | null> {
    const balance = await this.get(user_id).then(Number);
    const convertedAmount = Number(amount);
    const difference = balance - convertedAmount;

    if (difference < 0) return null;

    return difference;
  }

  // async topUp(details: DepositData) {
   
  // }
}
