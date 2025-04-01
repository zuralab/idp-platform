import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Deployment} from './deployment.entity';
import {Repository} from 'typeorm';
import {CreateDeploymentDto} from './dto/create-deployment.dto';
import {User, UserRole} from '../users/user.entity';
import {instanceToPlain} from "class-transformer";
import {LogEntryDto} from "./dto/log-entry.dto";


const MOCK_LOGS: LogEntryDto[] = [
    {timestamp: new Date(Date.now() - 60000).toISOString(), message: 'Starting container...'},
    {timestamp: new Date(Date.now() - 40000).toISOString(), message: 'Fetching image: nginx'},
    {timestamp: new Date(Date.now() - 20000).toISOString(), message: 'Container running on port 8080'},
    {timestamp: new Date().toISOString(), message: 'Health check passed ✓'},
];

@Injectable()

export class DeploymentsService {
    constructor(
        @InjectRepository(Deployment)
        private deploymentRepo: Repository<Deployment>,
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {
    }


    async create(deploymentData: CreateDeploymentDto, userPayload: any) {
        const user = await this.userRepo.findOneBy({id: userPayload.id || userPayload.sub});

        if (!user) throw new NotFoundException('User not found');

        const deployment = this.deploymentRepo.create({
            ...deploymentData,
            user,
            status: 'running',
        });

        return this.deploymentRepo.save(deployment);
    }

    async findAllForUser(userId: number) {
        return await this.deploymentRepo.find({
            where: {user: {id: userId}},
            order: {createdAt: 'DESC'},
        });
    }


    async findAll() {
        const deployments = await this.deploymentRepo.find({
            relations: ['user'],
            order: {createdAt: 'DESC'},
        });

        return instanceToPlain(deployments);
    }

    async updateStatus(id: number, status: 'running' | 'stopped' | 'failed') {
        const deployment = await this.deploymentRepo.findOne({where: {id}});
        if (!deployment) return {message: 'Deployment not found'};

        deployment.status = status;
        await this.deploymentRepo.save(deployment);
        return {message: `Deployment ${id} status updated to ${status}`};
    }

    async getMockLogs(deploymentId: number, user: any) {
        const deployment = await this.deploymentRepo.findOne({
            where: {id: deploymentId},
            relations: ['user'],
        });

        if (!deployment) {
            throw new Error('Deployment not found');
        }

        const isOwner = user.role === 'developer' && user.id === deployment.user.id;
        const isLead = user.role === 'team_lead';

        if (!isOwner && !isLead) {
            throw new Error('Access denied to deployment logs');
        }

        return MOCK_LOGS;
    }

    async createFromWebhook(payload: any) {
        const repoName = payload?.repository?.name || 'unknown-repo';
        const latestCommit = payload?.commits?.[0]?.message || 'No commit message';
        const randomPort = 3000 + Math.floor(Math.random() * 1000);

        const mockDeployment = this.deploymentRepo.create({
            containerName: `${repoName}-auto-deploy`,
            image: 'ghcr.io/sample/image',
            port: randomPort,
            status: 'running',
            user: {id: 1} as any,
        });

        await this.deploymentRepo.save(mockDeployment);
        console.log(`✅ Mock deployment created for repo: ${repoName}`);
    }


    async getDeploymentsForUser(user: { id: number; role: string }) {
        if (user.role === UserRole.Admin || user.role === UserRole.TeamLead) {
            return this.deploymentRepo.find({
                relations: ['user'],
                order: {createdAt: 'DESC'},
            });
        }

        return this.deploymentRepo.find({
            where: {user: {id: user.id}},
            relations: ['user'],
            order: {createdAt: 'DESC'},
        });
    }
}
