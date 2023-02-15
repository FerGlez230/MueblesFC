import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ErrorHandler } from 'src/common/handlers/error-handler';
import { PaymentsHelper } from './helpers/payments.helper';
import { DatesHelper } from 'src/common/helpers/dates.helper';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly errorHandler: ErrorHandler,
    private readonly paymentHelper: PaymentsHelper,
    private readonly datesHelper: DatesHelper,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { purchase } = createPaymentDto;
      await this.insertPaymentDB(createPaymentDto);
      const paymentsHistory = await this.getPaymentHistory(purchase.id);
      const paymentSum =
        this.paymentHelper.calculatePaymentsSum(paymentsHistory);
      const balanceDue = purchase.total - paymentSum;
      const minDate = this.paymentHelper.getMinDate(paymentsHistory);
      console.log(minDate);
      console.log(this.datesHelper.getWeeksBetween(minDate, purchase.date));
      const weeksLeft =
        purchase.weeks -
        this.datesHelper.getWeeksBetween(minDate, purchase.date);
      return {
        history: { ...paymentsHistory },
        balanceDue,
        weeksLeft,
        purchaseId: purchase.id,
      };
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
  private async insertPaymentDB(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.paymentRepository.create(createPaymentDto);
      await this.paymentRepository.save(payment);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
  private async getPaymentHistory(id: string) {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder('p');
      return await queryBuilder
        .where('p.purchaseId = :purchase', {
          purchase: `${id}`,
        })
        .getMany();
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
