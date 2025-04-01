import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Deployment} from "../deployments/deployment.entity";
import {Exclude} from 'class-transformer';

export enum UserRole {
    Developer = 'developer',
    TeamLead = 'team_lead',
    Admin = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.Developer})
    role: UserRole;

    @OneToMany(() => Deployment, (deployment) => deployment.user)
    deployments: Deployment[];
}

