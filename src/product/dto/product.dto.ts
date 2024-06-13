import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  images: string[];

  @IsString()
  categoryId: string;

  @IsNumber()
  price: number;
}
