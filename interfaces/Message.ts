import { User } from "./User";

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  content: string;
  conversation: string;
  sendAt: Date;
}

export interface SendMessage {
  id?: number;
  sender: User;
  receiver: User;
  content: string;
  conversation: string;
  sendAt: Date;
}