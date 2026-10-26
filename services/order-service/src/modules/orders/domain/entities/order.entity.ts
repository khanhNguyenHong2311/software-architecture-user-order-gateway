export interface OrderProps {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
}

export class Order {
  constructor(private readonly props: OrderProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get status(): string {
    return this.props.status;
  }
}
