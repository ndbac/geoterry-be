import { Document2Interface } from 'src/shared/mongoose/types';
import { CreateProfileReqDto } from './dto/create-profile.dto';
import { ProfileDocument } from './profile.model';

export type IProfile = Document2Interface<ProfileDocument>;

export interface ICreateProfileData
  extends InstanceType<typeof CreateProfileReqDto> {
  userId?: string;
  slug?: string;
}
