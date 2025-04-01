import {Controller, Post, Body, Request, UseGuards, Get, Param, ParseIntPipe} from '@nestjs/common';
import {DeploymentsService} from './deployments.service';
import {CreateDeploymentDto} from './dto/create-deployment.dto';
import {AuthGuard} from '@nestjs/passport';
import {Roles} from '../auth/roles.decorator';
import {RolesGuard} from '../auth/roles.guard';
import {UserRole} from "../users/user.entity";

@Controller('deploy')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DeploymentsController {
    constructor(private readonly deploymentsService: DeploymentsService) {
    }

    @Post()
    @Roles(UserRole.Developer)
    async createDeployment(
        @Body() dto: CreateDeploymentDto,
        @Request() req
    ) {
        const user = req.user;
        return await this.deploymentsService.create(dto, user);
    }

    @Get(':id/logs')

    async getLogs(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return await this.deploymentsService.getMockLogs(id, req.user);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.Developer, UserRole.TeamLead, UserRole.Admin)
    @Get()
    getDeployments(@Request() req) {
        return this.deploymentsService.getDeploymentsForUser(req.user);
    }
}
