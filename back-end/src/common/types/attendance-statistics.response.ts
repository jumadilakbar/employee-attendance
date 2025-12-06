import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AttendanceStatistics {
  @Field(() => Int)
  totalPresent: number;

  @Field(() => Int)
  totalAbsent: number;

  @Field(() => Int)
  totalLate: number;

  @Field(() => Int)
  totalExcused: number;

  @Field(() => Int)
  attendanceRate: number; // Percentage
}

