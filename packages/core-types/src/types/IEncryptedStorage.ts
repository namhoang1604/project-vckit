import { IPluginMethodMap } from './IAgent';
import { TKeyType } from './IIdentifier';
export interface IEncryptAndStoreDataArgs {
  data: any;
  keyPair?: any;
  kms?: string;
  type?: TKeyType;
}

export interface IEncryptedStorage extends IPluginMethodMap {
  encryptAndStoreData(args: IEncryptAndStoreDataArgs): Promise<string>;
}
