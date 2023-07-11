import { IPluginMethodMap } from './IAgent';
export interface IEncryptAndStoreDataArgs {
  data: any;
  keyPair?: any;
}

export interface IEncryptedStorage extends IPluginMethodMap {
  encryptAndStoreData(args: IEncryptAndStoreDataArgs): Promise<string>;
}
