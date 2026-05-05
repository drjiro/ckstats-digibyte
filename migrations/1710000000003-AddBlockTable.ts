import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlockTable1710000000003 implements MigrationInterface {
  name = 'AddBlockTable1710000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "Block" (
        "id" SERIAL PRIMARY KEY,
        "height" INTEGER NOT NULL,
        "blockhash" VARCHAR NOT NULL,
        "username" VARCHAR NOT NULL,
        "workername" VARCHAR NOT NULL,
        "reward" BIGINT NOT NULL,
        "diff" DOUBLE PRECISION NOT NULL,
        "minedAt" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "Block_height_unique" UNIQUE ("height")
      )
    `);
    await queryRunner.query(`CREATE INDEX "Block_height_idx" ON "Block" ("height")`);
    await queryRunner.query(`CREATE INDEX "Block_minedAt_idx" ON "Block" ("minedAt")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Block"`);
  }
}
