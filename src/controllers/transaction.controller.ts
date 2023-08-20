import { Request } from "express";
import { TransactionService } from "../services/transactions.service";

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  async getDetails(req: Request) {
    const { transactionId } = req.params;
    const details = await this.service.getDetails(transactionId);
    return details;
  }

  async purchase(req: any) {
    const { user_id } = req.identification;
    const { target } = req.body;
    await this.service.purchase(user_id, target);
  }

  async cancel(req: Request) {
    const { transactionId } = req.params;
    await this.service.cancel(transactionId);
  }
}
