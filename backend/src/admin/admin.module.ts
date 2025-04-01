import {AdminController} from "./admin.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/user.entity";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AdminController],
})
export class AdminModule {
}
