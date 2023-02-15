import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsHelper } from './helpers/payments.helper';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsHelper],
  imports: [CommonModule, TypeOrmModule.forFeature([Payment])],
})
export class PaymentsModule {}
