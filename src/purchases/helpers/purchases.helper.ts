import { PriceHelper } from 'src/common/helpers/prices.helper';
import { PartialPurchase } from '../entities';

export class PurchasesHelper {
  private priceHelper = new PriceHelper();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  public calculateTotalPriceWithProfit(total: number, weeks: number): number {
    return weeks <= 12
      ? this.priceHelper.getShortTermPayment(total)
      : this.priceHelper.getLongTermPayment(total);
  }
  public calculateTotalSumatoryPrice(
    partialPurchases: PartialPurchase[],
  ): number {
    const ACCUMULATOR_VALUE = 0;
    return partialPurchases.reduce((accumulator, currentPartialPurchase) => {
      return (
        accumulator +
        currentPartialPurchase.price * currentPartialPurchase.quantity
      );
    }, ACCUMULATOR_VALUE);
  }
}
