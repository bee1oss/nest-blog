import { Controller } from '@nestjs/common'
import { RefreshTokenService } from './refreshtoken.service'

@Controller('refreshtoken')
export class RefreshtokenController {
	constructor(private readonly refreshtokenService: RefreshTokenService) {}
}
