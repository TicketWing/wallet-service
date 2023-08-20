import e, { NextFunction, Response } from "express";
import { Socket } from "socket.io";
import { ErrorConstructor, ResponseConstructor } from "ticketwing-storage-util";

export const responseHTTPMiddleware =
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

export const responseSocketMiddleware = (socket: Socket, next: any) => {
  const originHandler = socket.emit;

  socket.emit = (event: string, ...args: any[]) => {
    let response: ResponseConstructor<any>;

    const error: Error | ErrorConstructor = args.find(
      (el: any) => el instanceof Error || el instanceof ErrorConstructor
    );

    if (error) {
      response = new ResponseConstructor(false, `${event}: ${error.message}`);
    } else {
      const data = { ...args };
      response = new ResponseConstructor(true, `${event}: Success!`, data);
    }

    return originHandler.call(socket, event, response);
  };

  next();
};
