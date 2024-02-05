import { PaymentStatus } from 'src/modules/domain/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class PaymentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  sum_rub: number;

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  sum_howled: number;

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  service_commission: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Created })
  status: PaymentStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
