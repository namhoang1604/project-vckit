import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { EncryptedData } from '../entities/encrypted-data.js';
import { getConnectedDb } from '../utils.js';

/**
 * @public
 */
export class EncryptedDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async saveEncryptedData(args: {
    data: string;
    publicKeyHex: string;
    type: string;
  }): Promise<void> {
    const { data, publicKeyHex, type } = args;

    const encryptedData = new EncryptedData();
    encryptedData.publicKeyHex = publicKeyHex;
    encryptedData.type = type;
    encryptedData.jwe = data;

    const db = await getConnectedDb(this.dbConnection);
    await db.getRepository(EncryptedData).save(encryptedData);
  }
}
