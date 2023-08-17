import { BalanceService } from "../services/balance.service";

export class BalanceController {
  private service: BalanceService;

  constructor() {
    this.service = new BalanceService();
  }
}
