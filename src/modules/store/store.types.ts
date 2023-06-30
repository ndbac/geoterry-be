import { Document2Interface } from 'src/shared/mongoose/types';
import { CreateStoreReqDto } from './dto/create-store.dto';
import { StoreDocument } from './store.model';

export type IStore = Document2Interface<StoreDocument>;

export interface ICreateStoreData
  extends InstanceType<typeof CreateStoreReqDto> {
  userId?: string;
  slug?: string;
}
