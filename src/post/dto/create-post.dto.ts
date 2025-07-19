import { IsString, IsOptional, IsArray } from 'class-validator'

export class CreatePostDto {
	@IsString()
	title: string

	@IsOptional()
	@IsString()
	slug?: string

	@IsOptional()
	@IsString()
	summary?: string

	@IsString()
	content: string

	@IsOptional()
	@IsArray()
	tags?: string[] // tag isimleri olacak (örnek: ['javascript', 'nestjs'])

	@IsOptional()
	@IsString()
	metaTitle?: string

	@IsOptional()
	@IsString()
	metaDescription?: string

	@IsOptional()
	@IsString()
	coverImage?: string
}
