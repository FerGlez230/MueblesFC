export class PriceHelper {
  private MULTIPLO = 10;
  public getMultiploSuperior(price: number, significance: number) {
    return Math.ceil(price / significance) * significance;
  }
  public getShortTermPayment(price: number): number {
    const finalPrice = price * 1.5;
    return this.getMultiploSuperior(finalPrice, this.MULTIPLO);
  }
  public getLongTermPayment(price: number): number {
    const finalPrice = price * 2.2;
    return this.getMultiploSuperior(finalPrice, this.MULTIPLO);
  }
}
