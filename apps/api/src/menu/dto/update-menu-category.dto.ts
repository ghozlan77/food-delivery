import { IsOptional, IsString } from 'class-validator';

export class UpdateMenuCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;
}
