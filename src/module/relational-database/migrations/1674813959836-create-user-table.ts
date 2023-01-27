import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const tableName = 'users';

export class createUserTable1674813959836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'name',
            type: 'nvarchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner) {
    return await queryRunner.dropTable(tableName);
  }
}
