import {DataSourceOptions} from 'typeorm';
import {User} from '../users/user.entity';
import {Deployment} from "../deployments/deployment.entity";
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Deployment],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
};
