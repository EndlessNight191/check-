import { Module } from '@nestjs/common';
import { ServiceModule } from './modules/service/service.module';
import { ContrrollerModule } from './modules/controller/controller.module';
import { DomainModule } from './modules/domain/domain.module';

@Module({
  imports: [ServiceModule, ContrrollerModule, DomainModule],
})
export class AppModule {}
