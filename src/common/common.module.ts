import { Module } from '@nestjs/common';
import { ErrorHandler } from './handlers/error-handler';
import { PriceHelper } from './helpers/prices.helper';
import { DatesHelper } from './helpers/dates.helper';

@Module({
  providers: [ErrorHandler, PriceHelper, DatesHelper],
  exports: [ErrorHandler, PriceHelper, DatesHelper],
})
export class CommonModule {}
