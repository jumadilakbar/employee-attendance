import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, registerEnumType, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { SortInput } from '../../../common/types/sort.input';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity('users')
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ name: 'username', type: 'varchar', length: 100, unique: true })
  username: string;

  @Field(() => String)
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Field(() => UserRole)
  @Column({ name: 'role', type: 'varchar', length: 20 })
  role: UserRole;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@InputType()
export class UserFilter {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

// SortInput is imported from common/types/sort.input.ts
export { SortInput, SortOrder } from '../../../common/types/sort.input';

