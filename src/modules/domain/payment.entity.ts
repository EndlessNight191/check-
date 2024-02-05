export enum PaymentStatus {
  Created = 'created',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type UpdatedPathnerStatus =
  | PaymentStatus.Approved
  | PaymentStatus.Rejected;

export interface CreatePaymentEntityDto {
  id: string;
  url: string;
  sumRub: number;
  sumHowled: number;
  serviceCommission: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDB {
  url: string;
  sumRub?: number;
  sumHowled?: number;
  serviceCommission?: number;
  status?: PaymentStatus; // пока необязательные
}

export class PaymentEntity {
  constructor(data: CreatePaymentEntityDto) {
    this.id = data.id;
    this.url = data.url;
    this.sumRub = data.sumRub;
    this.sumHowled = data.sumHowled;
    this.serviceCommission = data.serviceCommission;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  id: string;

  url: string;

  sumRub: number;

  sumHowled: number;

  serviceCommission: number;

  status: PaymentStatus;

  createdAt: Date;

  updatedAt: Date;

  public startChecks(
    defCheckFunc: (id: string, lastUpdatedAt: Date) => void,
    seconds: number,
  ) {
    setTimeout(() => {
      defCheckFunc(this.id, this.updatedAt);
    }, seconds * 1000);
  }
}
