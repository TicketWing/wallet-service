import { HandledFunction } from "../types/paypal.types";

export class PayPalUtils {
  constructor() {}
  getApprovalLink(payment: any) {
    const approvalLink = payment.links.find(
      (link: any) => link.rel === "approval_url"
    );

    if (approvalLink) {
      return approvalLink.href;
    }
  }

  handle<T>(fn: HandledFunction<T>, ...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fn(...args, (error: any, response: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}
