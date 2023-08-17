export class DepositTransaction {
  readonly item_list = {
    items: [
      {
        name: "Deposit",
        sku: "1",
        price: "0.0",
        currency: "",
        quantity: 1,
      },
    ],
  };

  readonly amount = {
    currency: "",
    total: "0.0",
  };

  readonly description = "Top up transaction";

  constructor(price: string, currency: string) {
    this.item_list.items[0].currency = currency;
    this.item_list.items[0].price = price;
    this.amount.currency = currency;
    this.amount.total = price;
  }
}

export class Deposit {
  readonly intent = "sale";
  readonly payer = {
    payment_method: "paypal",
  };
  readonly redirect_urls = {
    return_url: "http://your-website.com/succes",
    cancel_url: "http://your-website.com/cancel",
  };

  readonly transactions: DepositTransaction[];
  constructor(transactions: DepositTransaction[]) {
    this.transactions = transactions;
  }
}

export class DepositDetails {
  readonly type = "payment";
  readonly id: string;
  readonly state: string;
  constructor(payment: any) {
    this.id = payment.id;
    this.state = payment.state;
  }
}

export class DepositExecute {
  readonly payer_id: string;

  readonly transactions = [
    {
      amount: {
        currency: "",
        total: "",
      },
    },
  ];

  constructor(total: string, currency: string, payer_id: string) {
    this.payer_id = payer_id;
    this.transactions[0].amount.currency = currency;
    this.transactions[0].amount.total = total;
  }
}
