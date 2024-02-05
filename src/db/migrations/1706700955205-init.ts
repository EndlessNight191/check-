import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1706700955205 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`
        CREATE TABLE payments (
          id UUID DEFAULT uuid_generate_v4(),
          url VARCHAR(255) NOT NULL,
          sum_rub NUMERIC(12,2) NOT NULL,
          sum_howled NUMERIC(18,8) NOT NULL,
          service_commission NUMERIC(18,8) NOT NULL,
          status ENUM ('created', 'pending', 'approved', 'rejected') DEFAULT 'created' NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      `);

      await queryRunner.query(`
        CREATE TABLE payments_history (
          id UUID DEFAULT uuid_generate_v4(),
          payment_id UUID REFERENCES payments(id) NOT NULL,
          parthner_id UUID,
          status ENUM('created', 'pending', 'approved', 'rejected_parthner', 'rejected') DEFAULT 'created' NOT NULL,
          cause_update ENUM('update_parthner', 'our_system') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      `);

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS payments;');
    await queryRunner.query('DROP TABLE IF EXISTS payments_history;');
  }
}
