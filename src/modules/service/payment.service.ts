import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PaymentRepository } from '../adapter/db/payment/payment.repository';
import {
  PaymentEntity,
  PaymentStatus,
  UpdatedPathnerStatus,
} from '../domain/payment.entity';
import { PaymentSystemUpdated } from '../domain/payment-history.entity';

@Injectable()
export class PaymentService {
  private server: Server;

  constructor(private readonly paymentRepository: PaymentRepository) {}

  setServer(server: Server): void {
    this.server = server;
  }

  private emitPayment(paymentData: any): void {
    if (this.server) {
      this.server.emit('newPayment', paymentData);
    }
  }

  async createPayment(url: string): Promise<PaymentEntity> {
    // в конструктор domain или в service??? // в конструкторе домена вызвать сервис и билдить неоходимые поля?? // шаблон??
    const payment = await this.paymentRepository.createPayment({ url: url });

    delete payment.url; // скрываем url
    this.emitPayment(payment);
    return payment;
  }

  async getPaymentsByFields(
    fields: Partial<PaymentEntity>,
  ): Promise<PaymentEntity[]> {
    const payments = await this.paymentRepository.getPaymentsByFields(fields);
    return payments;
  }

  async startProcessPayment(
    orderId: string,
    parthnerId: string,
  ): Promise<PaymentEntity> {
    const order = await this.getById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === PaymentStatus.Created) {
      const updatedOrder = await this.updateOrderStatus(
        orderId,
        PaymentStatus.Pending,
        PaymentSystemUpdated.UpdateParthner,
      );
      updatedOrder.startChecks(this.checkPaymentLatency, 15); // проверка latency

      this.server.emit('orderStatusUpdated', {
        orderId,
        status: PaymentStatus.Pending,
      }); // уведомление о новом статусе заказа???

      return updatedOrder;
    } else if (order.status === PaymentStatus.Pending) {
      throw new Error('Payment is already pending');
    } else {
      throw new Error('Invalid order status');
    }
  }

  async updateStatusParthers(
    orderId: string,
    parthnerId: string,
    status: UpdatedPathnerStatus,
  ): Promise<PaymentEntity> {
    // логика по истории платежа и проверки на партнера
    // валидация на сам платеж, латенси и т.д

    const payment = await this.updateOrderStatus(
      orderId,
      status,
      PaymentSystemUpdated.UpdateParthner,
    );
    return payment;
  }

  private async getById(orderId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.getPaymentById(orderId);
    return payment;
  }

  private async updateOrderStatus(
    orderId: string,
    newStatus: PaymentStatus,
    system: PaymentSystemUpdated,
  ) {
    const paymentId = await this.paymentRepository.updatePaymentStatus(
      orderId,
      newStatus,
      system,
    );
    if (!paymentId) throw new Error('Payment not found');
    return this.getById(paymentId);
  }

  // проверяется дата последнего обновления в бд, если она такая же как и lastUpdatedAt и status: Pending,
  // при этом currentTime > lastUpdatedAt + 15 second, то возвращаем платеж обратно на ветрину
  private async checkPaymentLatency(id: string, lastUpdatedAt: Date) {
    const payment = await this.paymentRepository.getPaymentById(id);
    if (
      payment.updatedAt === lastUpdatedAt &&
      payment.status === PaymentStatus.Pending &&
      lastUpdatedAt.getTime() + 15 * 1000 < new Date().getTime()
    ) {
      this.updateOrderStatus(
        id,
        PaymentStatus.Created,
        PaymentSystemUpdated.OutSystem,
      );
    }

    return;
  }
}
