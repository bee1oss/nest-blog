import { Controller, Post, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('protected')
	@Auth()
	someProtectedHandler(@Req() req) {
		return { message: 'Giriş başarılı' }
	}
}
