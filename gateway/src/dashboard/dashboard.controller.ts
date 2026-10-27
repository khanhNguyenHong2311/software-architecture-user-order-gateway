import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import axios from "axios";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  private readonly userServiceUrl: string;
  private readonly orderServiceUrl: string;

  constructor() {
    this.userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3001";
    this.orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://localhost:3002";
  }

  @Get()
  async getDashboard(@Headers("x-user-id") userId: string) {
    try {
      const [userResponse, ordersResponse] = await Promise.all([
        axios.get(`${this.userServiceUrl}/users/me`, {
          headers: { "x-user-id": userId },
        }),
        axios.get(`${this.orderServiceUrl}/orders/my-orders`, {
          headers: { "x-user-id": userId },
        }),
      ]);

      return {
        user: userResponse.data,
        orders: ordersResponse.data,
      };
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message || error.message || "Failed to aggregate dashboard data";
      throw new HttpException({ statusCode: status, message }, status);
    }
  }
}
