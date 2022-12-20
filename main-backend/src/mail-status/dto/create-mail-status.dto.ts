import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Status {
  New = 'New',
  InProgress = 'In Progress',
  Succeeded = 'Succeeded',
}

export class CreateMailStatusDto {
  @IsString()
  readonly email: string;

  @IsNumber()
  readonly totalCount: number;

  @IsNumber()
  @IsOptional()
  readonly sentCount: number;

  @IsString()
  @IsOptional()
  readonly status: Status;

  @IsDateString()
  @IsOptional()
  readonly createdAt: string;

  @IsDateString()
  @IsOptional()
  readonly updatedAt: string;
}
