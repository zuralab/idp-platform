import {Module} from '@nestjs/common';
import {MonitorController} from './monitor.controller';
import {DeploymentsModule} from '../deployments/deployments.module';

@Module({
    imports: [DeploymentsModule],
    controllers: [MonitorController],
})
export class MonitorModule {
}
