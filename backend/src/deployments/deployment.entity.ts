import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn} from 'typeorm';
import {User} from '../users/user.entity';

export type DeploymentStatus = 'running' | 'stopped' | 'failed';

@Entity()
export class Deployment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    containerName: string;

    @Column()
    image: string;

    @Column()
    port: number;

    @Column({type: 'varchar', default: 'running'})
    status: DeploymentStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.deployments, {
        eager: true,
        onDelete: 'CASCADE',
    })
    user: User;
}
