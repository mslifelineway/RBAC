import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdministratorRepository } from './administrator.repository';
import { Administrator } from './schemas/administrator.schema';
import { CreateAdministratorDto } from './dtos/create-administrator.dto';

@Injectable()
export class AdministratorService {
  private readonly logger = new Logger();

  constructor(
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  async getAdministrators(
    getAdministratorsArgs: Partial<Administrator>,
  ): Promise<Administrator[]> {
    return await this.administratorRepository.find(getAdministratorsArgs);
  }

  async getAdministrator(
    getAdministratorArgs: Partial<Administrator>,
  ): Promise<Administrator> {
    return await this.administratorRepository.findOne(getAdministratorArgs);
  }

  async create(data: Administrator): Promise<Administrator> {
    await this.validateCreateAdministratorRequest(data);
    try {
      const administrator = await this.administratorRepository.create({
        ...data,
        password: await bcrypt.hash(data.password, 10),
      });
      return administrator;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async validateCreateAdministratorRequest(request: Administrator) {
    try {
      const administrator = await this.administratorRepository.findOne({
        email: request.email,
      });
      if (administrator) {
        throw new UnprocessableEntityException('Email already exists.');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async validateAdministrator(email: string, password: string) {
    const user = await this.administratorRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
