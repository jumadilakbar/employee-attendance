import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Attendance, AttendanceStatus } from '../attendance/entities/attendance.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll(
    filter?: {
      userId?: string;
      fullName?: string;
      age?: number;
      class?: string;
      subject?: string;
    },
    sort?: { field?: string; order?: 'ASC' | 'DESC' },
    page?: number,
    limit?: number,
  ): Promise<{ employees: Employee[]; totalCount: number; totalPages: number; currentPage: number; limit: number }> {
    const queryBuilder = this.employeesRepository.createQueryBuilder('employee');

    // Apply filters
    if (filter) {
      if (filter.userId) {
        queryBuilder.andWhere('employee.userId = :userId', { userId: filter.userId });
      }
      if (filter.fullName) {
        queryBuilder.andWhere('employee.fullName ILIKE :fullName', { fullName: `%${filter.fullName}%` });
      }
      if (filter.age) {
        queryBuilder.andWhere('employee.age = :age', { age: filter.age });
      }
      if (filter.class) {
        queryBuilder.andWhere('employee.class = :class', { class: filter.class });
      }
      if (filter.subject) {
        queryBuilder.andWhere('employee.subjects @> :subject', {
          subject: JSON.stringify([filter.subject]),
        });
      }
    }

    // Apply sorting
    if (sort && sort.field) {
      // Gunakan field yang diberikan client, default order ASC jika tidak di-set
      queryBuilder.orderBy(`employee.${sort.field}`, sort.order || 'ASC');
    } else {
      // Default sort: createdAt DESC
      queryBuilder.orderBy('employee.createdAt', 'DESC');
    }

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const currentPage = page || 1;
    const pageLimit = limit || 10;
    const totalPages = Math.ceil(totalCount / pageLimit);
    const offset = (currentPage - 1) * pageLimit;

    queryBuilder.limit(pageLimit);
    queryBuilder.offset(offset);

    const employees = await queryBuilder.getMany();

    // Calculate attendance statistics for each employee
    const employeesWithStats = await Promise.all(
      employees.map(async (employee) => {
        const attendanceStats = await this.calculateAttendanceStats(employee.id);
        return {
          ...employee,
          totalAttendance: attendanceStats.total,
          attendancePercentage: attendanceStats.percentage,
        };
      })
    );

    return { employees: employeesWithStats, totalCount, totalPages, currentPage, limit: pageLimit };
  }

  private async calculateAttendanceStats(employeeId: string): Promise<{ total: number; percentage: number }> {
    const attendanceRepository = this.dataSource.getRepository(Attendance);
    
    // Get total attendance count
    const totalCount = await attendanceRepository.count({
      where: { employeeId },
    });

    if (totalCount === 0) {
      return { total: 0, percentage: 0 };
    }

    // Get present count
    const presentCount = await attendanceRepository.count({
      where: { employeeId, status: AttendanceStatus.PRESENT },
    });

    // Calculate percentage
    const percentage = Math.round((presentCount / totalCount) * 100);

    return { total: totalCount, percentage };
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { id } });
  }

  async create(employeeData: Partial<Employee>): Promise<Employee> {
    const employee = this.employeesRepository.create(employeeData);
    return this.employeesRepository.save(employee);
  }

  async update(id: string, employeeData: Partial<Employee>): Promise<Employee> {
    await this.employeesRepository.update(id, employeeData);
    const employee = await this.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.employeesRepository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  async getStatistics(): Promise<{
    totalEmployees: number;
    activeEmployees: number;
    avgAttendance: number;
    onLeave: number;
  }> {
    const totalEmployees = await this.employeesRepository.count();
    const activeEmployees = totalEmployees; // All employees are considered active

    // Calculate average attendance percentage across all employees
    const employees = await this.employeesRepository.find();
    let totalAttendancePercentage = 0;
    let employeesWithAttendance = 0;

    for (const employee of employees) {
      const stats = await this.calculateAttendanceStats(employee.id);
      if (stats.total > 0) {
        totalAttendancePercentage += stats.percentage;
        employeesWithAttendance++;
      }
    }

    const avgAttendance = employeesWithAttendance > 0
      ? Math.round(totalAttendancePercentage / employeesWithAttendance)
      : 0;

    // On leave: count employees with attendance status ABSENT or EXCUSED in recent days
    // For simplicity, we'll count employees who have recent absent/excused records
    const attendanceRepository = this.dataSource.getRepository(Attendance);
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7); // Last 7 days

    const onLeaveEmployees = await attendanceRepository
      .createQueryBuilder('attendance')
      .select('DISTINCT attendance.employeeId', 'employeeId')
      .where('attendance.date >= :recentDate', { recentDate: recentDate.toISOString().split('T')[0] })
      .andWhere('attendance.status IN (:...statuses)', {
        statuses: [AttendanceStatus.ABSENT, AttendanceStatus.EXCUSED],
      })
      .getRawMany();

    const onLeave = onLeaveEmployees.length;

    return {
      totalEmployees,
      activeEmployees,
      avgAttendance,
      onLeave,
    };
  }
}

