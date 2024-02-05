import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentModel } from '../payment/payment.model';
import { PaymentStatus } from 'src/modules/domain/payment.entity';
import { PaymentSystemUpdated } from 'src/modules/domain/payment-history.entity';

@Entity('payments_history')
export class PaymentHistoryModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PaymentModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: PaymentModel;

  @Column('uuid')
  paymentId: string;

  @Column('uuid')
  parthnerId?: string;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: false })
  status: string;

  @Column({
    type: 'enum',
    enum: PaymentSystemUpdated,
    default: PaymentSystemUpdated.OutSystem,
  })
  cause_update: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static createBuilder(
    paymentId: string,
    status: PaymentStatus,
    parthnerId?: string,
  ): PaymentHistoryModel {
    const paymentHistory = new PaymentHistoryModel();
    paymentHistory.paymentId = paymentId;
    paymentHistory.parthnerId = parthnerId;
    paymentHistory.status = status;
    paymentHistory.cause_update = parthnerId
      ? PaymentSystemUpdated.UpdateParthner
      : PaymentSystemUpdated.OutSystem;

    return paymentHistory;
  }
}
