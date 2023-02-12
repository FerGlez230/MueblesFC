import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../client/entities/client.entity';
import { CommonModule } from '../common/common.module';
import { Purchase } from './entities/purchase.entity';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PartialPurchase } from './entities/partial-purchase.entity';
import { PurchasesHelper } from './helpers/purchases.helper';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchasesHelper],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Purchase, Client, PartialPurchase]),
  ],
})
export class PurchasesModule {}
