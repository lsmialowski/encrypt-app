import {Column, CreateDateColumn, Entity} from 'typeorm';
import {PrimaryGeneratedColumn} from 'typeorm/decorator/columns/PrimaryGeneratedColumn';

@Entity('users')
export default class User {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: 'varchar', length: 255})
    public email: string;

    @Column({type: 'varchar', length: 255})
    public password: string;

    @Column({type: 'text', name: 'public_key'})
    public publicKey?: string;

    @CreateDateColumn({name: 'created_at'})
    private createdAt: Date;
}
