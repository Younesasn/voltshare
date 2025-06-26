import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { Message } from "@/interfaces/Message";

export function getConversation(otherId: number) {
  return api.get<Message[]>(`${apiUrl}/api/messages/${otherId}`);
}
