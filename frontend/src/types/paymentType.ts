export interface PaymentType {
  id: number;
  name: string;
  action: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
