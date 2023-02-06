export class PricesHelper {
  public getMultiploSuperior(price, significance) {
    return Math.ceil(price / significance) * significance;
  }
}
