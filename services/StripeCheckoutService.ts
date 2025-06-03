import api from "@/api/AuthAxios";
import { User } from "@/interfaces/User";

export function createSession({
  user,
  product_name,
  amount,
}: {
  user: User;
  product_name: string;
  amount: number;
}) {
  return api.post("/api/create-checkout-session", {
    user,
    product_name,
    amount,
  });
}
