import { All, Controller, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { ProxyService } from "./proxy.service";

@Controller()
@UseGuards(JwtAuthGuard)
export class ProxyController {
  private readonly userServiceUrl: string;
  private readonly orderServiceUrl: string;

  constructor(private readonly proxyService: ProxyService) {
    this.userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3001";
    this.orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://localhost:3002";
  }

  @All(["users", "users/{*path}"])
  async handleUsers(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.proxyService.forward(req, res, this.userServiceUrl);
  }

  @All(["orders", "orders/{*path}"])
  async handleOrders(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.proxyService.forward(req, res, this.orderServiceUrl);
  }
}
