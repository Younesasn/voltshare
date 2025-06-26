export interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  sendAt: Date;
}
