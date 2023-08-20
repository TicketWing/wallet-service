import { Router } from "express";
import { responseHTTPMiddleware } from "../middlewares/response.middleware";
import { TransactionController } from "../controllers/transaction.controller";
import { validate } from "ticketwing-storage-util";
import { DepositSchema } from "../validations/deposit.validation";

export const transactionController = new TransactionController();
export const transactionRouter = Router();

transactionRouter.get(
  "/details/:transactionId",
  responseHTTPMiddleware(
    transactionController.getDetails.bind(transactionController)
  )
);

transactionRouter.get(
  "/cancel/:transactionId",
  responseHTTPMiddleware(
    transactionController.cancel.bind(transactionController)
  )
);

transactionRouter.post(
  "/purchase",
  validate(DepositSchema),
  responseHTTPMiddleware(
    transactionController.purchase.bind(transactionController)
  )
);
