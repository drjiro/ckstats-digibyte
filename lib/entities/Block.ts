import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('Block')
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  height: number;

  @Column()
  blockhash: string;

  @Column()
  username: string;

  @Column()
  workername: string;

  @Column('bigint')
  reward: bigint;

  @Column('float')
  diff: number;

  @Column('timestamptz')
  @Index()
  minedAt: Date;
}
