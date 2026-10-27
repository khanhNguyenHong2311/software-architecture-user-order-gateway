import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { DashboardController } from "./dashboard/dashboard.controller";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ProxyController } from "./proxy/proxy.controller";
import { ProxyService } from "./proxy/proxy.service";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
  ],
  controllers: [DashboardController, ProxyController],
  providers: [
    ProxyService,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
