import { IsNumber, IsPositive } from "class-validator";

export class CreateOrderRequestDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
