import { ApiResponse } from "./ApiListResponse";
import { Message } from "./Message";
import { Reservation } from "./Reservation";
import { User } from "./User";

export interface Conversation extends ApiResponse {
  id?: number;
  host: User;
  customer: User;
  reservation: Reservation;
  open: boolean;
  messages: Message[];
}
