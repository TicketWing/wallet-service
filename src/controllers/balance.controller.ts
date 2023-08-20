import { Response } from "express";
import { BalanceService } from "../services/balance.service";

export class BalanceController {
  private service: BalanceService;

  constructor() {
    this.service = new BalanceService();
  }

  async get(req: any) {
    const { user_id } = req.identification;
    const balance = await this.service.get(user_id);
    return balance;
  }

  async topUp(req: any, res: Response) {
    const { target } = req.body;
    const { user_id } = req.identification;
    const approvalUrl = await this.service.topUp(user_id, target);
    res.redirect(approvalUrl);
  }
}
