import paypal from "paypal-rest-sdk";
import { PayPalConfig } from "../confs/paypal.config";
import { ApprovalData, HandledFunction } from "../types/paypal.types";
import { Initializable } from "../types/common.types";
import {
  DepositRequest,
  WithdrawRequest,
} from "../constructors/paypal.constructors";

export class PayPalUtils {
  private api: any;

  constructor() {
    this.api = paypal.configure(PayPalConfig);
  }

  handle<T>(fn: HandledFunction<T>, request: any): Promise<T> {
    return new Promise((resolve, reject) => {
      fn(request, (error: any, response: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  createRequest<A, B>(type: Initializable<A, B>, item: B) {
    return new type(item);
  }

  createPayment(request: DepositRequest): Promise<any> {
    const callback = this.api.payment.create;
    return this.handle<any>(callback, request);
  }

  createPayout(request: WithdrawRequest): Promise<any> {
    const callback = this.api.payout.create;
    return this.handle<any>(callback, request);
  }

  executePayment(input: ApprovalData): Promise<any> {
    const { PayerID, paymentId } = input;
    const callback = this.api.payment.execute;
    const executionData = { paymentId, payer_id: PayerID };
    return this.handle<any>(callback, executionData);
  }
}
