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
import { PayPalUtils } from "../utils/paypal.util";
import {
  Deposit,
  DepositTransaction,
} from "../constructors/paypal.constructors";

type DepositData = {
  amount: string;
  currency: string;
};

export class BalanceService {
  private table = "balances";
  private paypal: PayPalUtils;
  private storage: CacheableStorage;

  constructor() {
    this.paypal = new PayPalUtils();
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

  async topUp(user_id: string, details: DepositData) {
    const { amount, currency } = details;
    const transactions = new DepositTransaction(amount, currency);
    const deposit = new Deposit([transactions]);
    const payment = await this.paypal.createPayment(deposit);
    const approvalLink = this.paypal.getApprovalLink(payment);
    return approvalLink;
  }
}
