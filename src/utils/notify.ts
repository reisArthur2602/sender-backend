import { socket } from "../http/server.js";

export const notify = (event: string, payload: object) => {
  socket.emit(event, {
    ...payload,
    createdAt: new Date().toISOString(),
  });
};
