import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { EmployeesResolver } from './employees.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesService, EmployeesResolver],
  exports: [EmployeesService],
})
export class EmployeesModule {}

