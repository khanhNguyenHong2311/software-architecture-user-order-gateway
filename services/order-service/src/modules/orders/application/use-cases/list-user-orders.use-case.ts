import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from "../ports/order.repository.port";
import { OrderResponseDto } from "./create-order.use-case";

@Injectable()
export class ListUserOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findByUserId(userId);
    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
    }));
  }
}
