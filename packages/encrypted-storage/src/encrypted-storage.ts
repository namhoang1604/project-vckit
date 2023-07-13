import { EncryptedDataStore } from './identifier/encrypted-data-store.js';
import {
  IAgentPlugin,
  IEncryptAndStoreDataArgs,
  IEncrypteAndStoreDataResult,
  IEncryptedStorage,
} from '@vckit/core-types';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };
import {
  decryptString,
  encryptString,
  generateEncryptionKey,
} from '@govtechsg/oa-encryption';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';

/**
 * @public
 */
export class EncryptedStorage implements IAgentPlugin {
  readonly methods: IEncryptedStorage;
  readonly schema = schema.IEncryptedStorage;

  private store: EncryptedDataStore;
  constructor(options: { dbConnection: OrPromise<DataSource> }) {
    this.store = new EncryptedDataStore(options.dbConnection);
    this.methods = {
      encryptAndStoreData: this.encryptAndStoreData.bind(this),
      fetchEncryptedData: this.fetchEncryptedData.bind(this),
    };
  }

  async encryptAndStoreData(
    args: IEncryptAndStoreDataArgs
  ): Promise<IEncrypteAndStoreDataResult> {
    const { data, kms, type } = args;
    const key = generateEncryptionKey();

    const encryptedDocument = encryptString(JSON.stringify(data), key);

    const { id } = await this.store.saveEncryptedData(
      JSON.stringify(encryptedDocument)
    );

    return { id, key };
  }

  async fetchEncryptedData(args: { id: string; key: string }): Promise<string> {
    const { id, key } = args;
    const encryptedData = await this.store.getEncryptedData(id);
    if (!encryptedData) {
      throw new Error('Data not found');
    }

    return encryptedData;
  }
}
