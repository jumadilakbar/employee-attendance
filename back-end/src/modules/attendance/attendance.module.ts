import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceResolver } from './attendance.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  providers: [AttendanceService, AttendanceResolver],
  exports: [AttendanceService],
})
export class AttendanceModule {}

