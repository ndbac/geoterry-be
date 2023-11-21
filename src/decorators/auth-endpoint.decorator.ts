import { SetMetadata } from '@nestjs/common';
import { AUTH_METADATA_KEY } from 'src/shared/constants';
import { IAccountRole, IamNamespace } from 'src/shared/types';

export interface AuthEndpointDto {
  namespaces?: IamNamespace[];
  isPublic?: boolean;
  rolesRequired?: {
    namespace: IamNamespace;
    roles: IAccountRole[];
  }[];
}

export const AuthEndpoint = (data: AuthEndpointDto) => {
  return SetMetadata(AUTH_METADATA_KEY, data);
};
