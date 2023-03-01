import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { ErrorHandler } from 'src/common/handlers/error-handler';
import { PaymentsHelper } from './helpers/payments.helper';
import { DatesHelper } from 'src/common/helpers/dates.helper';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

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
  async findAll(paymentId: string) {
    return await this.getPaymentHistory(paymentId);
  }

  async findOne(id: string) {
    try {
      const payment = await this.paymentRepository.findOneBy({ id });
      if (!payment) {
        throw new NotFoundException(`${ErrorMessages.MISSING_OBJECT} el abono`);
      }
      return payment;
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    let date = undefined;
    try {
      if (updatePaymentDto.date) {
        date = await this.paymentRepository.query(
          `SELECT TO_DATE('${updatePaymentDto.date}','DyMonDDYYYY')`,
        );
      }
      await this.paymentRepository.update(id, {
        ...updatePaymentDto,
        date: date[0].to_date,
      });
      return {
        ...payment,
        ...updatePaymentDto,
        date: date ? this.datesHelper.getDate(date[0]?.to_date) : undefined,
      };
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.paymentRepository.delete(id);
  }
}
