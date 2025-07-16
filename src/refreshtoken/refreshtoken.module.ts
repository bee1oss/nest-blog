import { Module } from '@nestjs/common'
import { RefreshTokenService } from './refreshtoken.service'
import { RefreshtokenController } from './refreshtoken.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [RefreshtokenController],
	providers: [RefreshTokenService, PrismaService],
	exports: [RefreshTokenService]
})
export class RefreshtokenModule {}
