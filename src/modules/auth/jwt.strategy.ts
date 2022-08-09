import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: any) {
    // console.log(payload);

    // check if user in the token actually exist
    const userInfo = await this.userService.findOneByEmail(payload.username);
    if (!userInfo) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }

    const { password, ...user } = userInfo['dataValues'];
    // console.log('user Info', user);

    return user;
  }
}
