export interface Message {
  id: number;
  sender: string;
  receiver: string;
  content: string;
  sendAt: Date;
}
