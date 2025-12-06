import { DataSource } from 'typeorm';
import { dataSource } from '../../config/database.config';
import { seedUsers } from './user.seed';
import { seedEmployees } from './employee.seed';
import { seedAttendance } from './attendance.seed';
import { seedAdditionalData } from './additional-data.seed';

async function runSeed() {
  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Database connected');

    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations completed');

    console.log('Seeding users...');
    await seedUsers(dataSource);

    console.log('Seeding employees...');
    await seedEmployees(dataSource);

    console.log('Seeding attendance...');
    await seedAttendance(dataSource);

    console.log('Seeding additional data (10 users, 10 employees, 2 months attendance)...');
    await seedAdditionalData(dataSource);

    console.log('Seeding completed successfully');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();

