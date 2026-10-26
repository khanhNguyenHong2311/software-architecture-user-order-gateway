import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Order } from "../../domain/entities/order.entity";
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from "../ports/order.repository.port";

export interface CreateOrderDto {
  userId: string;
  totalAmount: number;
}

export interface OrderResponseDto {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const order = new Order({
      id: randomUUID(),
      userId: dto.userId,
      totalAmount: dto.totalAmount,
      status: "PENDING",
    });

    await this.orderRepository.save(order);

    return {
      id: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
      status: order.status,
    };
  }
}
