import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ErrorHandler } from '../common/handlers/error-handler';
import { Purchase, PartialPurchase } from './entities';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { PurchasesHelper } from './helpers/purchases.helper';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(PartialPurchase)
    private readonly partialPurchaseRepository: Repository<PartialPurchase>,
    private readonly errorHandler: ErrorHandler,
    private readonly purchaseHelper: PurchasesHelper,
  ) {}
  async create(createPurchaseDto: CreatePurchaseDto) {
    try {
      const { partialPurchases, ...purchaseDetails } = createPurchaseDto;
      // eslint-disable-next-line prettier/prettier
      let total = this.purchaseHelper.calculateTotalSumatoryPrice(partialPurchases);
      total = this.purchaseHelper.calculateTotalPriceWithProfit(
        total,
        createPurchaseDto.weeks,
      );
      const purchase = this.purchaseRepository.create({
        ...purchaseDetails,
        total,
        partialPurchase: partialPurchases.map((partialPurchase) =>
          this.partialPurchaseRepository.create({
            product: partialPurchase.product,
            quantity: partialPurchase.quantity,
            price: partialPurchase.product.price,
          }),
        ),
      });
      return await this.purchaseRepository.save(purchase);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  findAll() {
    return `This action returns all purchases`;
  }

  async findOne(id: string) {
    try {
      const purchase = await this.purchaseRepository.findOneBy({ id });
      if (!purchase)
        throw new NotFoundException(
          `${ErrorMessages.MISSING_OBJECT} la cuenta`,
        );
      return purchase;
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = this.findOne(id);
    try {
      await this.purchaseRepository.update(id, updatePurchaseDto);
      return { ...purchase, ...updatePurchaseDto };
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async remove(id: string) {
    this.findOne(id);
    try {
      return await this.purchaseRepository.delete(id);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
}
