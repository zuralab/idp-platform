import {Module} from '@nestjs/common';
import {WebhookController} from './webhook.controller';
import {DeploymentsModule} from '../deployments/deployments.module';

@Module({
    imports: [DeploymentsModule],
    controllers: [WebhookController],
})
export class WebhookModule {
}
