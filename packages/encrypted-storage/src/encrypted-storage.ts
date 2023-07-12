import { EncryptedDataStore } from './identifier/encrypted-data-store.js';
import {
  IAgentPlugin,
  IEncryptAndStoreDataArgs,
  IEncryptedStorage,
} from '@vckit/core-types';
import schema from '@vckit/core-types/build/plugin.schema.json' assert { type: 'json' };
import { KeyManager } from '@veramo/key-manager';
import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';

/**
 * @public
 */
export class EncryptedStorage implements IAgentPlugin {
  readonly methods: IEncryptedStorage;
  readonly schema = schema.IEncryptedStorage;

  private store: EncryptedDataStore;
  private keyManager: KeyManager;
  constructor(options: {
    dbConnection: OrPromise<DataSource>;
    keyManager: KeyManager;
  }) {
    this.store = new EncryptedDataStore(options.dbConnection);
    this.keyManager = options.keyManager;
    this.methods = {
      encryptAndStoreData: this.encryptAndStoreData.bind(this),
    };
  }

  async encryptAndStoreData(args: IEncryptAndStoreDataArgs): Promise<string> {
    const { data, kms, type } = args;
    const key = await this.keyManager.keyManagerCreate({
      kms: kms || 'local',
      type: type || 'Ed25519',
    });

    const encryptedData = await this.keyManager.keyManagerEncryptJWE({
      kid: key.kid,
      to: key,
      data: JSON.stringify(data),
    });

    await this.store.saveEncryptedData({
      data: encryptedData,
      publicKeyHex: key.publicKeyHex,
      type: key.type,
    });

    return key.publicKeyHex;
  }
}
