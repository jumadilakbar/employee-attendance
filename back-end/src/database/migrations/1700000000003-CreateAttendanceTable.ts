import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateAttendanceTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attendance',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'employee_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'attendance',
      new TableIndex({
        name: 'idx_attendance_employee_id',
        columnNames: ['employee_id'],
      }),
    );

    await queryRunner.createIndex(
      'attendance',
      new TableIndex({
        name: 'idx_attendance_date',
        columnNames: ['date'],
      }),
    );

    await queryRunner.createForeignKey(
      'attendance',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedTableName: 'employees',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      'ALTER TABLE attendance ADD CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, date)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('attendance');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('attendance', fk);
      }
      await queryRunner.dropTable('attendance');
    }
  }
}
