import {
  CacheableStorage,
  ErrorConstructor,
  GetDBOptions,
  InsertDBOptions,
  StorageRequestBuilder,
  UpdateDBOptions,
} from "ticketwing-storage-util";
import { PayPalService } from "./paypal.service";
import { databasePool, redisClient } from "../connections/storage.connections";
import {
  Deposit,
  DepositTransaction,
} from "../constructors/paypal.constructors";
import { ApprovalData } from "../types/paypal.types";
import { depositsQueue } from "../queues/deposit.queue";
import {
  DepositData,
  TransactionData,
  TransactionStatus,
} from "../types/transaction.types";
import { transactionsQueue } from "../queues/transaction.queue";

export class TransactionService {
  private table = "transactions";
  private paypal: PayPalService;
  private storage: CacheableStorage;

  constructor() {
    this.paypal = new PayPalService();
    this.storage = new CacheableStorage(databasePool, redisClient, this.table);
  }

  async getDetails(id: string) {
    const dbQueries: GetDBOptions = {
      where: { id },
      select: ["status", "amount", "currency", "description", "date"],
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
    const dbQueries = { returning: ["id"] };

    const queries = new StorageRequestBuilder<InsertDBOptions, undefined>(
      dbQueries
    ).build();

    const id = await this.storage.insert(transaction, queries);
    const job = { id, user_id, amount: target.amount };
    await transactionsQueue.createJob(job).save();
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

  async createDeposit(user_id: string, data: DepositData) {
    const { amount, currency } = data;
    const transactions = new DepositTransaction(amount, currency);
    const { description } = transactions;
    const deposit = new Deposit([transactions]);
    const payment = await this.paypal.createPayment(deposit);
    const { id } = payment;
    const inserting = { id, user_id, amount, currency, description };
    const dbQueries = { returning: [] };

    const queries = new StorageRequestBuilder<InsertDBOptions, undefined>(
      dbQueries
    ).build();

    await this.storage.insert(inserting, queries);
    depositsQueue.createJob({ id, user_id });
    const approvalLink = this.paypal.getApprovalLink(payment);
    return approvalLink;
  }

  async executeDeposit(data: ApprovalData) {
    const details = await this.getDetails(data.paymentId);
    const { amount, currency } = details;
    await this.paypal.executePayment(data, amount, currency);
  }
}
