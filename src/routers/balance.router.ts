import { Router } from "express";
import { BalanceController } from "../controllers/balance.controller";
import { responseHTTPMiddleware } from "../middlewares/response.middleware";

export const balanceController = new BalanceController();
export const balanceRouter = Router();

balanceRouter.post(
  "/topUp",
  responseHTTPMiddleware(balanceController.topUp.bind(balanceController))
);
