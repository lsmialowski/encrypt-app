import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Users1548949536369 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        queryRunner.createTable(new Table({
            name: 'users',
            columns: [{
                type: 'integer',
                name: 'id',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            }, {
                isNullable: false,
                type: 'varchar',
                name: 'email',
                isUnique: true,
                length: '255',
            }, {
                isNullable: false,
                type: 'varchar',
                name: 'password',
                length: '255',
            },{
                isNullable: true,
                type: 'text',
                name: 'public_key',
            }, {
                isNullable: false,
                type: 'timestamp',
                name: 'created_at',
            },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
       await queryRunner.dropTable('users');

    }

}
