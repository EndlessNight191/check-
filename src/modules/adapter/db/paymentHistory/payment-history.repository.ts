import { DataSource, Repository } from 'typeorm';
import dataSourceOptions from '../cfg';
import { UtilsService } from 'src/modules/utils/utils.service';
import { PaymentHistoryModel } from './payment-history.model';

export class PaymentHistoryRepository {
  private paymentHistoryRepository: Repository<PaymentHistoryModel>;

  constructor(private utilsService: UtilsService) {
    this.paymentHistoryRepository = new DataSource(
      dataSourceOptions,
    ).getRepository(PaymentHistoryModel);
  }
}
