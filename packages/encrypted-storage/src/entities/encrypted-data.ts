import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('encrypted-data')
export class EncryptedData extends BaseEntity {
  @PrimaryColumn()
  publicKeyHex!: string;

  @Column()
  type!: string;

  @Column()
  jwe!: string;

  @BeforeInsert()
  setSaveDate() {
    this.saveDate = new Date();
    this.updateDate = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updateDate = new Date();
  }

  @Column({ select: false })
  // @ts-ignore
  saveDate: Date;

  @Column({ select: false })
  // @ts-ignore
  updateDate: Date;
}
