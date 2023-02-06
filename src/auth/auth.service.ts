import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from 'src/common/handlers/error-handler';
import { LoginUserDto } from './dto/login-user.dto';
import { ErrorMessages } from 'src/common/enums/error-messages-enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly errorHandler: ErrorHandler,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const user = {
      ...userData,
      password: bcrypt.hashSync(password, 10),
    };
    this.userRepository.create(user);
    console.log(this.constructor.name);
    try {
      const userDB = await this.userRepository.save(user);
      delete userDB.password;
      return userDB;
    } catch (error) {
      this.errorHandler.handleDBException(error, this.constructor.name);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    if (!loginUserDto.email && !loginUserDto.username) {
      throw new BadRequestException(ErrorMessages.MISSING_PARAMETERS_LOGIN);
    }
    const searchCriteria = loginUserDto.email
      ? { email: loginUserDto.email }
      : { username: loginUserDto.username };
    const user = await this.userRepository.findOne({
      where: searchCriteria,
      select: { email: true, password: true, id: true },
    });
    if (!user)
      throw new UnauthorizedException(ErrorMessages.MISSING_USER_LOGIN);

    if (!bcrypt.compareSync(loginUserDto.password, user.password))
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);

    return { user };
  }
}
