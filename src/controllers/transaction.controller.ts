import { TransactionService } from "../services/transactions.service";

export class TransactionController {
  private service: TransactionService;

  constructor() {
    this.service = new TransactionService();
  }

  
}
