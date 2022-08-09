import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { UserUpdateDto } from './dto/userUpdate.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async update(id, user): Promise<any> {
    console.log('id, user', id, user);
    try {
      const [updatedUser] = await this.userRepository.update(
        { ...user },
        { where: { id: id } },
      );

      console.log('updatedUser ', updatedUser);

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error('User Update Failed');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }
}
