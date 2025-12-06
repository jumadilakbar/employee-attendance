import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/users/entities/user.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Users already seeded');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      username: 'admin',
      email: 'admin@company.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
    {
      username: 'employee1',
      email: 'employee@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'sarah',
      email: 'sarah.johnson@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'michael',
      email: 'michael.chen@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'emily',
      email: 'emily.rodriguez@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
    {
      username: 'david',
      email: 'david.kim@company.com',
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    },
  ];

  await userRepository.save(users);
  console.log(`Seeded ${users.length} users`);
}

