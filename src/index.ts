import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToMongo } from "./connections/storage.connections";
import { AppRouters } from "./routers/index.router";

dotenv.config();

const app = express();

const appRouter = new AppRouters(app);

connectToMongo();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

appRouter.init();
