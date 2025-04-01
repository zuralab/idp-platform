import {Controller, Post, Body, Headers} from '@nestjs/common';
import {DeploymentsService} from '../deployments/deployments.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly deploymentsService: DeploymentsService) {
    }

    @Post('github')
    async handleGitHubWebhook(@Body() payload: any, @Headers() headers: any) {
        console.log('📦 GitHub Webhook Received');
        console.log('➡️  Repo:', payload?.repository?.name);
        console.log('➡️  Ref:', payload?.ref);
        console.log('➡️  Commits:', payload?.commits?.map((c) => c.message));

        await this.deploymentsService.createFromWebhook(payload);

        return {message: 'Webhook processed successfully'};
    }
}
