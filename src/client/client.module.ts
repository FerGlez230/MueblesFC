import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientController } from './client.controller';
import { CommonModule } from 'src/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

@Module({
  controllers: [ClientController],
  providers: [ClientsService],
  imports: [CommonModule, TypeOrmModule.forFeature([Client])],
})
export class ClientsModule {}
