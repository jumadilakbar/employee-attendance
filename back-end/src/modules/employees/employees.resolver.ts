import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Employee, EmployeeInput, EmployeeUpdateInput, EmployeeFilter } from './entities/employee.entity';
import { SortInput } from '../../common/types/sort.input';
import { PaginationInfo } from '../../common/types/pagination.response';
import { EmployeeStatistics } from '../../common/types/employee-statistics.response';
import { EmployeesService } from './employees.service';

@Resolver(() => Employee)
export class EmployeesResolver {
  constructor(private readonly employeesService: EmployeesService) {}

  @Query(() => [Employee])
  async employees(
    @Args('filter', { type: () => EmployeeFilter, nullable: true }) filter?: EmployeeFilter,
    @Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<Employee[]> {
    const result = await this.employeesService.findAll(filter, sort, page, limit);
    return result.employees;
  }

  @Query(() => PaginationInfo)
  async employeesPagination(
    @Args('filter', { type: () => EmployeeFilter, nullable: true }) filter?: EmployeeFilter,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<PaginationInfo> {
    const result = await this.employeesService.findAll(filter, undefined, page, limit);
    return {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      hasNextPage: result.currentPage < result.totalPages,
      hasPreviousPage: result.currentPage > 1,
    };
  }

  @Query(() => Employee, { nullable: true })
  async employee(@Args('id') id: string): Promise<Employee | null> {
    return this.employeesService.findById(id);
  }

  @Mutation(() => Employee)
  async createEmployee(@Args('input') input: EmployeeInput): Promise<Employee> {
    return this.employeesService.create(input);
  }

  @Mutation(() => Employee)
  async updateEmployee(
    @Args('id') id: string,
    @Args('input') input: EmployeeUpdateInput,
  ): Promise<Employee> {
    return this.employeesService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteEmployee(@Args('id') id: string): Promise<boolean> {
    return this.employeesService.delete(id);
  }

  @Query(() => EmployeeStatistics)
  async employeeStatistics(): Promise<EmployeeStatistics> {
    return this.employeesService.getStatistics();
  }
}

