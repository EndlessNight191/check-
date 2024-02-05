import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../adapter/db/payment/payment.repository';
import { PaymentService } from './payment.service';
import { PaymentHistoryRepository } from '../adapter/db/paymentHistory/payment-history.repository';

@Injectable()
export class PaymentHistoryService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentHistoryRepository: PaymentHistoryRepository,
  ) {}
}
