import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Attendance, AttendanceInput, AttendanceUpdateInput, AttendanceFilter } from './entities/attendance.entity';
import { SortInput } from '../../common/types/sort.input';
import { PaginationInfo } from '../../common/types/pagination.response';
import { AttendanceStatistics } from '../../common/types/attendance-statistics.response';
import { AttendanceService } from './attendance.service';

@Resolver(() => Attendance)
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Query(() => [Attendance])
  async attendance(
    @Args('filter', { type: () => AttendanceFilter, nullable: true }) filter?: AttendanceFilter,
    @Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<Attendance[]> {
    const result = await this.attendanceService.findAll(filter, sort, page, limit);
    return result.attendance;
  }

  @Query(() => PaginationInfo)
  async attendancePagination(
    @Args('filter', { type: () => AttendanceFilter, nullable: true }) filter?: AttendanceFilter,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<PaginationInfo> {
    const result = await this.attendanceService.findAll(filter, undefined, page, limit);
    return {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      hasNextPage: result.currentPage < result.totalPages,
      hasPreviousPage: result.currentPage > 1,
    };
  }

  @Query(() => Attendance, { nullable: true })
  async attendanceById(@Args('id') id: string): Promise<Attendance | null> {
    return this.attendanceService.findById(id);
  }

  @Mutation(() => Attendance)
  async markAttendance(@Args('input') input: AttendanceInput): Promise<Attendance> {
    // Check if attendance already exists for this employee and date
    const existing = await this.attendanceService.findByEmployeeAndDate(
      input.employeeId,
      input.date,
    );
    if (existing) {
      throw new Error('Attendance already marked for this employee on this date');
    }
    return this.attendanceService.create(input);
  }

  @Mutation(() => Attendance)
  async updateAttendance(
    @Args('id') id: string,
    @Args('input') input: AttendanceUpdateInput,
  ): Promise<Attendance> {
    return this.attendanceService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteAttendance(@Args('id') id: string): Promise<boolean> {
    return this.attendanceService.delete(id);
  }

  @Query(() => AttendanceStatistics)
  async attendanceStatistics(): Promise<AttendanceStatistics> {
    return this.attendanceService.getStatistics();
  }
}

