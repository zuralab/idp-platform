import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Deployment} from './deployment.entity';
import {DeploymentsController} from './deployments.controller';
import {DeploymentsService} from './deployments.service';
import {User} from '../users/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Deployment, User])],
    controllers: [DeploymentsController],
    providers: [DeploymentsService],
    exports: [DeploymentsService],
})
export class DeploymentsModule {
}
