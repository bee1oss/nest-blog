import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsOptional()
	@IsString()
	name: string

	@IsString({
		message: 'mail is required'
	})
	@IsEmail()
	email: string

	@MinLength(6, {
		message: 'password must contain at least 6 characters'
	})
	@IsString({
		message: 'password is required'
	})
	passwd: string
}
