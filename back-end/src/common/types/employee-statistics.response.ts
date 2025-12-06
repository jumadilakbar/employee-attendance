import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class EmployeeStatistics {
  @Field(() => Int)
  totalEmployees: number;

  @Field(() => Int)
  activeEmployees: number;

  @Field(() => Int)
  avgAttendance: number; // Percentage

  @Field(() => Int)
  onLeave: number;
}

