import { Column, PrimaryGeneratedColumn } from "typeorm";


export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: String })
    password: string;

    @Column({ default: 'user' })
    role: string;
}
