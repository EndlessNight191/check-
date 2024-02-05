import { PaymentEntity } from './payment.entity';

export enum PaymentSystemUpdated {
  UpdateParthner = 'update_parthner',
  OutSystem = 'our_system',
}

export enum PaymentHistoryStatus {
  Created = 'created',
  Pending = 'pending',
  Approved = 'approved',
  RejectedPathner = 'rejected_parthner',
  Rejected = 'rejected',
}

export class PaymentHistoryEntity {
  id: string;

  payment?: PaymentEntity;

  paymentId: string;

  parthnerId: string;

  status: PaymentHistoryStatus;

  causeUpdate: PaymentSystemUpdated;

  createdAt: Date;

  updatedAt: Date;
}
