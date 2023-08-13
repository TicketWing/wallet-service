import { Application } from "express";


export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {

  }
}
