import { UserEntity } from 'src/users/entities/user.entity';

export interface IOAuthUser {
  user: Pick<UserEntity, 'id' | 'email'>;
}
