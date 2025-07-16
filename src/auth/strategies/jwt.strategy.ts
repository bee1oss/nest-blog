import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					return req?.cookies?.['access_token'] || null
				}
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')!
		})
	}

	async validate({ id }: { id: string }) {
		const user = await this.userService.getById(id)
		if (!user) return null
		return user
	}
}
