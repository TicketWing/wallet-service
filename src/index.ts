import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

import { AppRouters } from "./routers/index.router";
import { processingTransactions } from "./workers/transaction.worker";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const appRouter = new AppRouters(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

appRouter.init();

processingTransactions();

io.on("connection", (socket) => {

});
