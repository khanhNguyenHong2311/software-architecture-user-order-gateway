import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/infrastructure/prisma/prisma.service";
import { ORDER_REPOSITORY_PORT } from "./application/ports/order.repository.port";
import { CreateOrderUseCase } from "./application/use-cases/create-order.use-case";
import { ListUserOrdersUseCase } from "./application/use-cases/list-user-orders.use-case";
import { PrismaOrderRepository } from "./infrastructure/persistence/prisma-order.repository";
import { OrdersController } from "./presentation/http/orders.controller";

@Module({
  controllers: [OrdersController],
  providers: [
    PrismaService,
    CreateOrderUseCase,
    ListUserOrdersUseCase,
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: PrismaOrderRepository,
    },
  ],
})
export class OrdersModule {}
