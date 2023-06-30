import { EIdentifierType, IamNamespace } from 'src/shared/types';

export interface IIamUserData {
  namespace: IamNamespace;
  userId: string;
  identifier: string;
  identifierType: EIdentifierType;
}
