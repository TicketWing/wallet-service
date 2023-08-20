import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { wrap } from "./middlewares/wrap.middleware";
import http from "http";
import passport from "passport";
import { Server } from "socket.io";
import { AppRouters } from "./routers/index.router";
import { applyPassportStrategy, authenticate } from "ticketwing-storage-util";
import { balanceController } from "./routers/balance.router";
import { responseSocketMiddleware } from "./middlewares/response.middleware";
import { initQueues } from "./queues/index.queue";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const appRouter = new AppRouters(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

applyPassportStrategy(passport);

appRouter.init();
initQueues();

//Finish with the queues!

export const activeSockets = new Map();

io.use(wrap(authenticate));
io.use(responseSocketMiddleware);

io.on("connection", (socket: any) => {
  const { id } = socket.request.identification;
  activeSockets.set(id, socket);

  socket.on("balance:get", async () => {
    const balance = await balanceController.get(id);
    const response = { balance };
    socket.emit("balance:get", response);
  });

  socket.on("disconnect", () => {
    activeSockets.delete(id);
  });
});
