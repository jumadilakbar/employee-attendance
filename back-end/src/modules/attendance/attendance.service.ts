import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Attendance,
  AttendanceStatus,
  AttendanceInput,
  AttendanceUpdateInput,
} from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(
    filter?: {
      employeeId?: string;
      date?: string;
      status?: AttendanceStatus;
    },
    sort?: {
      field?: string;
      order?: 'ASC' | 'DESC';
    },
    page?: number,
    limit?: number,
  ): Promise<{
    attendance: Attendance[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    const queryBuilder = this.attendanceRepository.createQueryBuilder('attendance');

    // Apply filters
    if (filter) {
      if (filter.employeeId) {
        queryBuilder.andWhere('attendance.employeeId = :employeeId', {
          employeeId: filter.employeeId,
        });
      }
      if (filter.date) {
        queryBuilder.andWhere('attendance.date = :date', { date: filter.date });
      }
      if (filter.status) {
        queryBuilder.andWhere('attendance.status = :status', { status: filter.status });
      }
    }

    // Apply sorting
    const sortField = sort?.field || 'date';
    const sortOrder = sort?.order || 'DESC';

    // Validate sort field
    const allowedSortFields = ['date', 'status', 'createdAt', 'updatedAt'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'date';

    queryBuilder.orderBy(`attendance.${validSortField}`, sortOrder as 'ASC' | 'DESC');

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const currentPage = page || 1;
    const pageLimit = limit || 10;
    const totalPages = Math.ceil(totalCount / pageLimit);
    const offset = (currentPage - 1) * pageLimit;

    queryBuilder.limit(pageLimit);
    queryBuilder.offset(offset);

    const attendance = await queryBuilder.getMany();

    return { attendance, totalCount, totalPages, currentPage, limit: pageLimit };
  }

  async findById(id: string): Promise<Attendance | null> {
    return this.attendanceRepository.findOne({ where: { id } });
  }

  async findByEmployeeAndDate(employeeId: string, date: string): Promise<Attendance | null> {
    return this.attendanceRepository.findOne({
      where: { employeeId, date: new Date(date) },
    });
  }

  async create(attendanceData: AttendanceInput): Promise<Attendance> {
    const attendance = this.attendanceRepository.create({
      ...attendanceData,
      date: new Date(attendanceData.date),
    });
    return this.attendanceRepository.save(attendance);
  }

  async update(id: string, attendanceData: AttendanceUpdateInput): Promise<Attendance> {
    const updateData: Partial<Attendance> = { ...attendanceData } as any;
    if (attendanceData.date) {
      (updateData as any).date = new Date(attendanceData.date);
    }
    await this.attendanceRepository.update(id, updateData);
    const attendance = await this.findById(id);
    if (!attendance) {
      throw new Error('Attendance not found');
    }
    return attendance;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.attendanceRepository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  async getStatistics(): Promise<{
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalExcused: number;
    attendanceRate: number;
  }> {
    const totalPresent = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.PRESENT },
    });

    const totalAbsent = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.ABSENT },
    });

    const totalLate = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.LATE },
    });

    const totalExcused = await this.attendanceRepository.count({
      where: { status: AttendanceStatus.EXCUSED },
    });

    const total = totalPresent + totalAbsent + totalLate + totalExcused;
    const attendanceRate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalExcused,
      attendanceRate,
    };
  }
}
