import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  Request,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { UserDto } from './dto/user.dto';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { User as UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('/')
  @UseInterceptors(TransformInterceptor)
  async update(
    @Body() user: UserUpdateDto,
    @Request() req,
  ): Promise<any> {
    // get the number of row affected and the updated post
    const updatedUser = await this.userService.update(req.user.id, user);

    // if the number of row affected is zero,
    // it means the post doesn't exist in our db
    if (!updatedUser) {
      throw new NotFoundException("This User doesn't exist");
    }
    const updatedUserData = await this.userService.findOneById(updatedUser);
    const { password, ...userData } = updatedUserData['dataValues'];

    return {
      status: 'success',
      message: 'User Updated',
      data: userData,
    };
  }
}
