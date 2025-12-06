import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateEmployeesTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'age',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'class',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'subjects',
            type: 'jsonb',
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
      'employees',
      new TableIndex({
        name: 'idx_employees_full_name',
        columnNames: ['full_name'],
      }),
    );

    await queryRunner.createIndex(
      'employees',
      new TableIndex({
        name: 'idx_employees_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('employees');
    if (table) {
      for (const fk of table.foreignKeys) {
        await queryRunner.dropForeignKey('employees', fk);
      }
      await queryRunner.dropTable('employees');
    }
  }
}
