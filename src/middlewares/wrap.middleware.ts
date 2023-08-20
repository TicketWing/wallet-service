import { Socket } from "socket.io";

export const wrap = (middleware: any) => (socket: Socket, next: any) =>
  middleware(socket.request, {}, next);
