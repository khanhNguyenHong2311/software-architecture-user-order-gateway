import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { ListUserOrdersUseCase } from "../../application/use-cases/list-user-orders.use-case";
import { CreateOrderRequestDto } from "./dto/create-order.request.dto";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listUserOrdersUseCase: ListUserOrdersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers("x-user-id") userId: string | undefined,
    @Body() dto: CreateOrderRequestDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }
    return this.createOrderUseCase.execute({
      userId,
      totalAmount: dto.totalAmount,
    });
  }

  @Get("my-orders")
  async getMyOrders(@Headers("x-user-id") userId?: string) {
    if (!userId) {
      throw new UnauthorizedException("Missing x-user-id header");
    }
    return this.listUserOrdersUseCase.execute(userId);
  }
}
