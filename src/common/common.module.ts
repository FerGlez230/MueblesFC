import { Module } from '@nestjs/common';
import { ErrorHandler } from './handlers/error-handler';
import { PricesHelper } from './helpers/prices.helper';

@Module({
  providers: [ErrorHandler, PricesHelper],
  exports: [ErrorHandler, PricesHelper],
})
export class CommonModule {}
