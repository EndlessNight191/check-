import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaymentModel } from './payment.model';
import dataSourceOptions from '../cfg';
import {
  CreatePaymentDB,
  PaymentEntity,
  PaymentStatus,
} from 'src/modules/domain/payment.entity';
import { UtilsService } from 'src/modules/utils/utils.service';
import { PaymentHistoryModel } from '../paymentHistory/payment-history.model';
import { PaymentSystemUpdated } from 'src/modules/domain/payment-history.entity';

export class PaymentRepository {
  private paymentRepository: Repository<PaymentModel>;
  private paymentHistoryRepository: Repository<PaymentHistoryModel>;

  constructor(private utilsService: UtilsService) {
    this.paymentRepository = new DataSource(dataSourceOptions).getRepository(
      PaymentModel,
    );
    this.paymentHistoryRepository = new DataSource(
      dataSourceOptions,
    ).getRepository(PaymentHistoryModel);
  }

  private mapPaymentModelToEntity(paymentModel: PaymentModel): PaymentEntity {
    return new PaymentEntity({
      id: paymentModel.id,
      url: paymentModel.url,
      sumHowled: paymentModel.sum_howled,
      sumRub: paymentModel.sum_rub,
      serviceCommission: paymentModel.service_commission,
      status: paymentModel.status,
      createdAt: new Date(paymentModel.created_at),
      updatedAt: new Date(paymentModel.updated_at),
    });
  }

  async createPayment(paymentData: CreatePaymentDB): Promise<PaymentEntity> {
    const paymentModel = this.paymentRepository.create({
      url: paymentData.url,
      sum_howled: paymentData.sumHowled,
      sum_rub: paymentData.sumRub,
      service_commission: paymentData.serviceCommission,
      status: PaymentStatus.Created,
    });

    const payment = await this.paymentRepository.save(paymentModel);
    return this.mapPaymentModelToEntity(payment);
  }

  async getPaymentById(id: string): Promise<PaymentEntity | undefined> {
    const payment = await this.paymentRepository.findOneBy({ id: id });
    return this.mapPaymentModelToEntity(payment);
  }

  async updatePaymentStatus(
    id: string,
    newStatus: PaymentStatus,
    parthnerId?: string,
  ): Promise<string | undefined> {
    return this.paymentRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const updatePayment = await transactionalEntityManager.update(
          PaymentModel,
          { id: id },
          { status: newStatus },
        );

        const paymentHistory = PaymentHistoryModel.createBuilder(
          id,
          newStatus,
          parthnerId,
        );
        await transactionalEntityManager.save(paymentHistory);

        // Вернуть id, если операции успешны
        if (updatePayment.affected) return id;
        return undefined;
      },
    );
  }

  async getAllPaymentsByStatus(
    status: PaymentStatus,
  ): Promise<PaymentEntity[]> {
    const payments = await this.paymentRepository.find({ where: { status } });
    return payments.map((item) => this.mapPaymentModelToEntity(item));
  }

  async getPaymentsByFields(
    fields: Partial<PaymentEntity>,
  ): Promise<PaymentEntity[]> {
    fields = this.utilsService.convertObjectKeys(
      fields,
      this.utilsService.snakeCase,
    );
    const queryBuilder = this.paymentRepository.createQueryBuilder('payment');

    for (const [fieldName, fieldValue] of Object.entries(fields)) {
      queryBuilder.andWhere(`payment.${fieldName} = :${fieldName}`, {
        [fieldName]: fieldValue,
      });
    }

    const paymentModels = await queryBuilder.getMany();
    return paymentModels.map(this.mapPaymentModelToEntity);
  }
}
