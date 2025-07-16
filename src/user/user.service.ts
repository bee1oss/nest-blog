import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				posts: true
			}
		})
		return user
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				posts: true
			}
		})
		return user
	}

	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				name: dto.name,
				email: dto.email,
				passwd: await hash(dto.passwd)
			}
		})
	}

	async validatePassword(
		plainPass: string,
		hashedPass: string
	): Promise<boolean> {
		return await verify(hashedPass, plainPass)
	}
}
