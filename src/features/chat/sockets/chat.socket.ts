import { socket } from "@/infrastructure/socket/socket.client";
import { ChatMessage } from "../types/chat.types";

export const joinChatConversation = (conversationId: string): void => {
  socket.emit("chat:join", conversationId);
};

export const leaveChatConversation = (conversationId: string): void => {
  socket.emit("chat:leave", conversationId);
};

export const sendChatSocketMessage = (
  conversationId: string,
  content: string,
  messageType = "TEXT",
): void => {
  socket.emit("chat:send", {
    conversationId,
    content,
    messageType,
  });
};

export const onChatMessage = (
  callback: (message: ChatMessage) => void,
): void => {
  socket.on("chat:message", callback);
};

export const offChatMessage = (
  callback: (message: ChatMessage) => void,
): void => {
  socket.off("chat:message", callback);
};

export const onChatSent = (
  callback: (message: ChatMessage) => void,
): void => {
  socket.on("chat:sent", callback);
};

export const offChatSent = (
  callback: (message: ChatMessage) => void,
): void => {
  socket.off("chat:sent", callback);
};

export const onChatNotification = (
  callback: (data: { conversationId: string; message: ChatMessage }) => void,
): void => {
  socket.on("chat:notification", callback);
};

export const offChatNotification = (
  callback: (data: { conversationId: string; message: ChatMessage }) => void,
): void => {
  socket.off("chat:notification", callback);
};

export const onChatError = (
  callback: (data: { event?: string; message: string }) => void,
): void => {
  socket.on("chat:error", callback);
};

export const offChatError = (
  callback: (data: { event?: string; message: string }) => void,
): void => {
  socket.off("chat:error", callback);
};

export const markChatAsRead = (conversationId: string): void => {
  socket.emit("chat:read", conversationId);
};

export const onChatSeen = (
  callback: (data: {
    conversationId: string;
    readerId: string;
    readAt: string;
  }) => void,
): void => {
  socket.on("chat:seen", callback);
};

export const offChatSeen = (
  callback: (data: {
    conversationId: string;
    readerId: string;
    readAt: string;
  }) => void,
): void => {
  socket.off("chat:seen", callback);
};
