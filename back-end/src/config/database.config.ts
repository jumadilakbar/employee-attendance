import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { User } from '../modules/users/entities/user.entity';
import { Employee } from '../modules/employees/entities/employee.entity';
import { Attendance } from '../modules/attendance/entities/attendance.entity';

// Load .env file for TypeORM CLI
// Try multiple paths to find .env file
const fs = require('fs');
const envPaths = [
  resolve(process.cwd(), '.env'),
  resolve(__dirname, '../../.env'),
  resolve(__dirname, '../../../.env'),
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`Loaded .env from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('Warning: .env file not found. Using default values or environment variables.');
}

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 54323),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_DATABASE', 'db_hris'),
  entities: [User, Employee, Attendance],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  // Don't load migrations in runtime, only for CLI
  migrations: [],
  migrationsTableName: 'migrations',
  autoLoadEntities: true,
});

// For TypeORM CLI
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'db_hris',
  entities: [User, Employee, Attendance],
  synchronize: false,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

// Debug: Log connection info (without password)
if (process.env.NODE_ENV === 'development') {
  const password = typeof dataSourceOptions.password === 'string' ? dataSourceOptions.password : 'NOT SET';
  console.log('Database Config:');
  console.log('  Host:', dataSourceOptions.host);
  console.log('  Port:', dataSourceOptions.port);
  console.log('  Username:', dataSourceOptions.username);
  console.log('  Database:', dataSourceOptions.database);
  console.log('  Password:', password ? '***' + password.slice(-4) : 'NOT SET');
}

export const dataSource = new DataSource(dataSourceOptions);

