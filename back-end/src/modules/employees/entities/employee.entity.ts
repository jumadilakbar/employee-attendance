import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field, registerEnumType, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, IsArray, IsEnum } from 'class-validator';

@ObjectType()
@Entity('employees')
export class Employee {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Field(() => String)
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  @Index()
  fullName: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'age', type: 'integer', nullable: true })
  age: number | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'class', type: 'varchar', length: 100, nullable: true })
  class: string | null;

  @Field(() => [String], { nullable: true })
  @Column({ name: 'subjects', type: 'jsonb', nullable: true })
  subjects: string[] | null;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed fields for attendance statistics
  @Field(() => Int, { nullable: true })
  totalAttendance?: number;

  @Field(() => Int, { nullable: true })
  attendancePercentage?: number;
}

@InputType()
export class EmployeeInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  userId?: string;

  @IsString()
  @Field(() => String)
  fullName: string;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  age?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  class?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  subjects?: string[];
}

@InputType()
export class EmployeeUpdateInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  userId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  fullName?: string;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  age?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  class?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  subjects?: string[];
}

@InputType()
export class EmployeeFilter {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  userId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  fullName?: string;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  age?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  class?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  subject?: string;
}

// SortInput is imported from common/types/sort.input.ts
export { SortInput, SortOrder } from '../../../common/types/sort.input';
