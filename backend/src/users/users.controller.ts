import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';

@Controller('users')
export class UsersController {
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Request() req) {
        return req.user;
    }
}
