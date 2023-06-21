import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SignupDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: SignupDto) {
    const now = new Date();

    const user = new UserEntity();
    user.id = createUserDto.id;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.createdAt = now;
    user.policyAgreementDate = now;

    await this.validate(user);

    await this.usersRepository.save(user);
  }

  async validate(user: UserEntity) {
    const emailDuplicationUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    const idDuplicationUser = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    if (emailDuplicationUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    if (idDuplicationUser) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    return true;
  }

  async findById(userId: string) {
    const user = this.usersRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}
