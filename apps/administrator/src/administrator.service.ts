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

@Injectable()
export class AdministratorService {
  private readonly logger = new Logger();

  constructor(
    private readonly administratorRepository: AdministratorRepository,
  ) {}

  async getAdministrators(
    getAdministratorsArgs: Partial<Administrator>,
  ): Promise<Administrator[]> {
    try {
      return await this.administratorRepository.find(getAdministratorsArgs);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while fetching administrator data',
        error.message,
      );
    }
  }

  async getAdministrator(
    getAdministratorArgs: Partial<Administrator>,
  ): Promise<Administrator> {
    return await this.administratorRepository.findOne(getAdministratorArgs);
  }

  async create(data: Administrator): Promise<Administrator> {
    try {
      const doc = await this.validateCreateAdministratorRequest(data);
      if (doc) {
        throw new UnprocessableEntityException(
          `Email '${data.email}' already exists.`,
        );
      }

      const administrator = await this.administratorRepository.create(data);
      return administrator;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async validateCreateAdministratorRequest(request: Administrator) {
    try {
      return await this.administratorRepository.findOne({
        email: request.email,
      });
    } catch (error) {}
  }

  async validateAdministrator(email: string, password: string) {
    const user = await this.administratorRepository.findOne({ email });
    this.logger.warn(
      '======> validate admin in admin service::',
      JSON.stringify(user),
      email,
      password,
    );
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}
