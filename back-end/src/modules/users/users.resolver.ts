import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserFilter } from './entities/user.entity';
import { SortInput } from '../../common/types/sort.input';
import { PaginationInfo } from '../../common/types/pagination.response';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(
    @Args('filter', { type: () => UserFilter, nullable: true }) filter?: UserFilter,
    @Args('sort', { type: () => SortInput, nullable: true }) sort?: SortInput,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<User[]> {
    const result = await this.usersService.findAll(filter, sort, page, limit);
    return result.users;
  }

  @Query(() => PaginationInfo)
  async usersPagination(
    @Args('filter', { type: () => UserFilter, nullable: true }) filter?: UserFilter,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<PaginationInfo> {
    const result = await this.usersService.findAll(filter, undefined, page, limit);
    return {
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      hasNextPage: result.currentPage < result.totalPages,
      hasPreviousPage: result.currentPage > 1,
    };
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role', { type: () => UserRole, nullable: true, defaultValue: UserRole.EMPLOYEE }) role: UserRole,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create(username, email, hashedPassword, role);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('username', { nullable: true }) username?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('role', { type: () => UserRole, nullable: true }) role?: UserRole,
  ): Promise<User> {
    return this.usersService.update(id, { username, email, role });
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}

