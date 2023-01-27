import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/module/relational-database/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createUser(userData: Omit<User, 'id'>) {
    return this.usersRepository.save(userData);
  }

  getUsers() {
    return this.usersRepository.find();
  }
}
