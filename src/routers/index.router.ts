import { Application } from "express";
import { authenticate } from "ticketwing-storage-util";
import { transactionRouter } from "./transaction.router";
import { balanceRouter } from "./balance.router";

export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {
    this.app.use(authenticate);
    this.app.use("/transaction", transactionRouter);
    this.app.use("/balance", balanceRouter);
  }
}
