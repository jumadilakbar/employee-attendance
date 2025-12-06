import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(
    filter?: {
      username?: string;
      email?: string;
      role?: UserRole;
    },
    sort?: {
      field?: string;
      order?: 'ASC' | 'DESC';
    },
    page?: number,
    limit?: number,
  ): Promise<{ users: User[]; totalCount: number; totalPages: number; currentPage: number; limit: number }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Apply filters
    if (filter) {
      if (filter.username) {
        queryBuilder.andWhere('user.username ILIKE :username', {
          username: `%${filter.username}%`,
        });
      }
      if (filter.email) {
        queryBuilder.andWhere('user.email ILIKE :email', {
          email: `%${filter.email}%`,
        });
      }
      if (filter.role) {
        queryBuilder.andWhere('user.role = :role', { role: filter.role });
      }
    }

    // Apply sorting
    const sortField = sort?.field || 'createdAt';
    const sortOrder = sort?.order || 'DESC';
    
    // Validate sort field
    const allowedSortFields = ['username', 'email', 'role', 'createdAt', 'updatedAt'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';
    
    queryBuilder.orderBy(`user.${validSortField}`, sortOrder as 'ASC' | 'DESC');

    // Get total count before pagination
    const totalCount = await queryBuilder.getCount();

    // Apply pagination
    const currentPage = page || 1;
    const pageLimit = limit || 10;
    const totalPages = Math.ceil(totalCount / pageLimit);
    const offset = (currentPage - 1) * pageLimit;

    queryBuilder.limit(pageLimit);
    queryBuilder.offset(offset);

    const users = await queryBuilder.getMany();

    return { users, totalCount, totalPages, currentPage, limit: pageLimit };
  }

  async create(username: string, email: string, password: string, role: UserRole): Promise<User> {
    const user = this.usersRepository.create({
      username,
      email,
      password,
      role,
    });
    return this.usersRepository.save(user);
  }

  async update(id: string, data: Partial<{ username: string; email: string; role: UserRole }>): Promise<User> {
    await this.usersRepository.update(id, data);
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }
}

