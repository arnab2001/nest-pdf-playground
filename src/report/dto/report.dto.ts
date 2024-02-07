import { IsString, IsNumber, IsArray } from 'class-validator';

export class ReportDto {
  @IsString()
  header: {
    title: string;
    date: string;
  };

  @IsArray()
  table: {
    headers: string[];
    rows: string[][];
  };
}