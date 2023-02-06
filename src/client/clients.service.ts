import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/common/handlers/error-handler';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

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

  remove(id: string) {
    this.findOne(id);
    try {
      return this.clientRepository.delete(id);
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
}
