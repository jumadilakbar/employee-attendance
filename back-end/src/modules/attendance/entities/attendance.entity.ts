import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ObjectType, Field, registerEnumType, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { SortInput } from '../../../common/types/sort.input';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

registerEnumType(AttendanceStatus, {
  name: 'AttendanceStatus',
});

@ObjectType()
@Entity('attendance')
export class Attendance {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ name: 'employee_id', type: 'uuid' })
  @Index()
  employeeId: string;

  @Field(() => String)
  @Column({ name: 'date', type: 'date' })
  @Index()
  date: Date;

  @Field(() => AttendanceStatus)
  @Column({ name: 'status', type: 'varchar', length: 20 })
  @Index()
  status: AttendanceStatus;

  @Field(() => String, { nullable: true })
  @Column({ name: 'note', type: 'varchar', length: 255, nullable: true })
  note: string | null;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@InputType()
export class AttendanceInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  date: string;

  @Field(() => AttendanceStatus)
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
}

@InputType()
export class AttendanceUpdateInput {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  date?: string;

  @Field(() => AttendanceStatus, { nullable: true })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
}

@InputType()
export class AttendanceFilter {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  date?: string;

  @Field(() => AttendanceStatus, { nullable: true })
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;
}

// SortInput is imported from common/types/sort.input.ts
export { SortInput, SortOrder } from '../../../common/types/sort.input';

