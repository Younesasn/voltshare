import api from "@/api/AuthAxios";
import { apiUrl } from "@/context/AuthContext";
import { Conversation } from "@/interfaces/Conversation";

export function getAllConversations() {
  return api.get(`${apiUrl}/api/conversations`);
}

export function getConversation(id: number) {
  return api.get<Conversation>(`${apiUrl}/api/conversations/${id}`);
}
