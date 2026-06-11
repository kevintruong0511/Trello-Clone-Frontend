import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { store } from "../redux/store";

export const useBoardSocket = (
  boardId: string | undefined,
  handlers: Record<string, (payload: any) => void>,
) => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!boardId) return;
    const token = store.getState().auth.accessToken;
    const socket: Socket = io({ auth: { token } });

    socket.on("connect", () => socket.emit("board:join", boardId));
    const events = Object.keys(handlersRef.current);
    for (const event of events) {
      socket.on(event, (payload) => handlersRef.current[event]?.(payload));
    }

    return () => {
      socket.emit("board:leave", boardId);
      socket.disconnect();
    };
  }, [boardId]);
};
