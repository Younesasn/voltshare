import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { SendMessage } from "@/interfaces/Message";

export function sendMessage(message: SendMessage) {
  return api.post<SendMessage[]>(`${apiUrl}/api/messages`, message);
}