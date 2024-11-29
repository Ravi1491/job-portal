import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  create(createUserInput: CreateUserDto) {
    return this.userModel.create(createUserInput);
  }

  findOne(payload = {}, options = {}): Promise<User | null> {
    return this.userModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.userModel.findAll({
      where: payload,
      ...options,
    });
  }

  async update(condition = {}, payload: UpdateUserDto, options = {}) {
    return this.userModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }
}
