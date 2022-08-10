import { profileType } from 'src/enums/profile-type.enum';

export interface createUserDTO {
  email: string;
  password: string;
  username: string;
  profileType?: profileType;
}
