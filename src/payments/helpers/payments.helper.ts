import { Payment } from '../entities/payment.entity';

export class PaymentsHelper {
  public getMinDate(payments: Payment[]) {
    const dates = payments.map((payment) => {
      return new Date(payment.date);
    });
    return new Date(Math.min.apply(null, dates));
  }
  public calculatePaymentsSum(payments: Payment[]) {
    return payments.reduce((prev, current) => {
      return prev + current.amount;
    }, 0);
  }
}
