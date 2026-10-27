import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../common/infrastructure/prisma/prisma.service";
import { OrderRepositoryPort } from "../../application/ports/order.repository.port";
import { Order } from "../../domain/entities/order.entity";

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(order: Order): Promise<void> {
    await this.prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const records = await this.prisma.order.findMany({ where: { userId } });
    return records.map(
      (record) =>
        new Order({
          id: record.id,
          userId: record.userId,
          totalAmount: record.totalAmount,
          status: record.status,
        }),
    );
  }
}
