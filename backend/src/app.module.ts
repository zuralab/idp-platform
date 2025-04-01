import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {typeOrmConfig} from "./config/typeorm.config";
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {AdminModule} from "./admin/admin.module";
import { DeploymentsModule } from './deployments/deployments.module';
import { MonitorController } from './monitor/monitor.controller';
import { MonitorModule } from './monitor/monitor.module';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookModule } from './webhook/webhook.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        UsersModule,
        AuthModule,
        AdminModule,
        DeploymentsModule,
        MonitorModule,
        WebhookModule,
    ],
    controllers: [AppController, MonitorController, WebhookController],
    providers: [AppService],
})
export class AppModule {
}
