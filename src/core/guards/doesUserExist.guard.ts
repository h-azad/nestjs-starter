import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    if (!request.body.email) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Invalid Data',
      }, HttpStatus.BAD_REQUEST);
    }
    const userExist = await this.userService.findOneByEmail(request.body.email);
    if (userExist) {
      throw new ForbiddenException('This email already exist');
    }
    return true;
  }
}
