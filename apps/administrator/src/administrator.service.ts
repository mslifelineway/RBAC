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

  async createAdministrator(
    request: CreateAdministratorDto,
  ): Promise<Administrator> {
    await this.validateCreateAdministratorRequest(request);
    const administrator = await this.administratorRepository.create({
      ...request,
      password: await bcrypt.hash(request.password, 10),
    });
    return administrator;
  }

  private async validateCreateAdministratorRequest(
    request: CreateAdministratorDto,
  ) {
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
