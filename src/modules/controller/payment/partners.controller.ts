import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  Put,
  Query,
  Body,
} from '@nestjs/common';
import { UpdatedPathnerStatus } from 'src/modules/domain/payment.entity';
import { PaymentService } from 'src/modules/service/payment.service';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Put(':orderId/:organizationId/hired') //акк, того, что партнер готов обрабатывать платеж
  async startProcessPayment(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
  ) {
    try {
      const result = await this.paymentService.startProcessPayment(
        orderId,
        organizationId,
      );
      return { status: 'success', result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':orderId/:organizationId') // партнер сообщает нам о том, что с платежом (оплачен или нет)
  async updateStatusPayment(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Param('organizationId', new ParseUUIDPipe()) organizationId: string,
    @Body('status') status: UpdatedPathnerStatus,
  ) {
    try {
      const result = await this.paymentService.updateStatusParthers(
        orderId,
        organizationId,
        status,
      );
      return { status: 'success', result };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
