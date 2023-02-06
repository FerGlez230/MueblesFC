import { BadRequestException, Logger } from '@nestjs/common';

export class ErrorHandler {
  private readonly logger = new Logger();
  public handleDBException(error: any, context: string) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.log(error, context);
    throw new Error('Check logs');
  }
}
