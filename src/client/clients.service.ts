import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/common/handlers/error-handler';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { FilterClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly errorHandler: ErrorHandler,
  ) {}
  async create(createClientDto: CreateClientDto) {
    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  findAll() {
    return `This action returns all client`;
  }
  async findBy(filterClientDto: FilterClientDto, options: IPaginationOptions) {
    const queryBuilder = this.clientRepository.createQueryBuilder('c');
    queryBuilder
      .where('c.name ilike :name', { name: `%${filterClientDto.name}%` })
      .andWhere('c.lastname ilike :lastname', {
        lastname: `%${filterClientDto.lastname}%`,
      })
      .andWhere('c.location = :location', {
        location: filterClientDto.location,
      });
    const queryResults = await paginate<Client>(queryBuilder, options);
    return queryResults;
  }
  async findOne(id: string) {
    try {
      const client = await this.clientRepository.findOneBy({ id });
      if (!client)
        throw new NotFoundException(
          `${ErrorMessages.MISSING_OBJECT} el cliente`,
        );
      return client;
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.findOne(id);
    try {
      await this.clientRepository.update(id, updateClientDto);
      return { ...client, ...updateClientDto };
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }

  async remove(id: string) {
    this.findOne(id);
    try {
      return await this.clientRepository.delete(id);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
}
