import {Injectable, ConflictException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User, UserRole} from '../users/user.entity';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService
    ) {
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({where: {email}});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(email: string, password: string, role: UserRole = UserRole.Developer) {
        const exists = await this.userRepo.findOne({where: {email}});
        if (exists) throw new ConflictException('Email is already registered');

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepo.create({
            email,
            password: hashedPassword,
            role: role || UserRole.Developer
        });

        await this.userRepo.save(newUser);

        return {message: 'User registered successfully'};
    }
}
