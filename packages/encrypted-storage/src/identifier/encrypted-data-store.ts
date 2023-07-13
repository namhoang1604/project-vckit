import { OrPromise } from '@veramo/utils';
import { DataSource } from 'typeorm';
import { EncryptedData } from '../entities/encrypted-data.js';
import { getConnectedDb } from '../utils.js';

/**
 * @public
 */
export class EncryptedDataStore {
  constructor(private dbConnection: OrPromise<DataSource>) {}

  async saveEncryptedData(data: string): Promise<EncryptedData> {
    const encryptedData = new EncryptedData();
    encryptedData.data = data;

    const db = await getConnectedDb(this.dbConnection);
    return await db.getRepository(EncryptedData).save(encryptedData);
  }

  async getEncryptedData(id: string): Promise<string | undefined> {
    const db = await getConnectedDb(this.dbConnection);
    const encryptedData = await db
      .getRepository(EncryptedData)
      .findOneBy({ id });
    return encryptedData?.data;
  }
}
