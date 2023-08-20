import paypal from "paypal-rest-sdk";
import { PayPalUtils } from "../utils/paypal.utils";
import { ApprovalData } from "../types/paypal.types";
import { PayPalConfig } from "../confs/paypal.config";
import { Deposit, DepositExecute } from "../constructors/paypal.constructors";

export class PayPalService extends PayPalUtils {
  private api = paypal.configure(PayPalConfig);

  constructor() {
    super();
  }

  getDetails(transactionId: string) {
    const callback = this.api.payment.get;
    return this.handle(callback, transactionId);
  }

  createPayment(request: Deposit): Promise<any> {
    const callback = this.api.payment.create;
    return this.handle<any>(callback, request);
  }

  executePayment(
    input: ApprovalData,
    total: string,
    currency: string
  ): Promise<any> {
    const { PayerID, paymentId } = input;
    const callback = this.api.payment.execute;
    const execution = new DepositExecute(total, currency, PayerID);
    return this.handle<any>(callback, execution);
  }
}
