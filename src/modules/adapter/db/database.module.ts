import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PaymentModel } from './payment/payment.model';
import dataSourceOptions from './cfg';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([PaymentModel]),
  ],
})
export class DatabaseModule {}
