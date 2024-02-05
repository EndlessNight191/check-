import { Module } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { AdapterModule } from '../adapter/adapter.module';
import { PaymentService } from './payment.service';
import { PaymentHistoryService } from './payment-history.service';

@Module({
  imports: [DomainModule, AdapterModule],
  providers: [PaymentService, PaymentHistoryService],
  exports: [PaymentService, PaymentHistoryService],
})
export class ServiceModule {}
