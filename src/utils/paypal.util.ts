import paypal from "paypal-rest-sdk";
import { PayPalConfig } from "../confs/paypal.config";
import { ApprovalData, HandledFunction } from "../types/paypal.types";
import { Deposit } from "../constructors/paypal.constructors";

export class PayPalUtils {
  private api: any;

  constructor() {
    this.api = paypal.configure(PayPalConfig);
  }

  getApprovalLink(payment: any) {
    for (var index = 0; index < payment.links.length; index++) {
      if (payment.links[index].rel === "approval_url") {
        return payment.links[index].href;
      }
    }
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

  createPayment(request: Deposit): Promise<any> {
    const callback = this.api.payment.create;
    return this.handle<any>(callback, request);
  }

  executePayment(input: ApprovalData): Promise<any> {
    const { PayerID, paymentId } = input;
    const callback = this.api.payment.execute;
    const executionData = { paymentId, payer_id: PayerID };
    return this.handle<any>(callback, executionData);
  }
}
