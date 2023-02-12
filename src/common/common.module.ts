import { Module } from '@nestjs/common';
import { ErrorHandler } from './handlers/error-handler';
import { PriceHelper } from './helpers/prices.helper';

@Module({
  providers: [ErrorHandler, PriceHelper],
  exports: [ErrorHandler, PriceHelper],
})
export class CommonModule {}
