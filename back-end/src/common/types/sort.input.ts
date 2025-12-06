import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});

@InputType()
export class SortInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  field?: string;

  @Field(() => SortOrder, { nullable: true })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}

