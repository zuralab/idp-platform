import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import {DeploymentsService} from '../deployments/deployments.service';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../auth/roles.guard';
import {Roles} from '../auth/roles.decorator';
import {UserRole} from "../users/user.entity";

@Controller('monitor')
@UseGuards(AuthGuard('jwt'), RolesGuard)

export class MonitorController {
    constructor(private readonly deploymentsService: DeploymentsService) {
    }

    @Get()
    async getAllDeployments() {
        return await this.deploymentsService.findAll();
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { status: 'running' | 'stopped' | 'failed' }
    ) {
        return await this.deploymentsService.updateStatus(id, body.status);
    }
}
