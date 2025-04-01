import {DataSource} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {User, UserRole} from "./users/user.entity";
import {typeOrmConfig} from "./config/typeorm.config";

const AppDataSource = new DataSource(typeOrmConfig);

async function seed() {
    await AppDataSource.initialize();
    const userRepo = AppDataSource.getRepository(User);

    const users = [
        {email: 'admin@example.com', password: 'password', role: UserRole.Admin},
        {email: 'lead@example.com', password: 'password', role: UserRole.TeamLead},
        {email: 'dev@example.com', password: 'password', role: UserRole.Developer},
    ];

    for (const userData of users) {
        const existing = await userRepo.findOneBy({email: userData.email});
        if (!existing) {
            const user = userRepo.create({
                ...userData,
                password: await bcrypt.hash(userData.password, 10),
            });
            await userRepo.save(user);
        }
    }

    console.log('✅ Seed complete');
    await AppDataSource.destroy();
}

seed().catch((e) => {
    console.error('❌ Seed error:', e);
    AppDataSource.destroy();
});
