import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LoginResponse } from './dto/login-response.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(email, password);
    return { access_token: result.access_token };
  }

  @Mutation(() => LoginResponse)
  async register(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role', { nullable: true, defaultValue: UserRole.EMPLOYEE }) role: UserRole,
  ): Promise<LoginResponse> {
    const result = await this.authService.register(username, email, password, role);
    return { access_token: result.access_token };
  }

  @Query(() => User, { name: 'authMe' })
  @UseGuards(JwtAuthGuard)
  async authMe(@Context() context: any): Promise<User> {
    const req = context.req;
    const payload = req.user as { userId: string };
    const user = await this.usersService.findById(payload.userId);
    return user!;
  }
}
