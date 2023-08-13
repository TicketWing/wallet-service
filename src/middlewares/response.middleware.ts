import { NextFunction, Response } from "express";
import { ResponseConstructor } from "ticketwing-storage-util";

export const responseMiddleware =
  (cb: any) => async (req: any, res: Response, next: NextFunction) => {
    try {
      const value = await cb(req);
      const resultData = value !== undefined ? value : null;
      const result = new ResponseConstructor(true, "Success", resultData);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
