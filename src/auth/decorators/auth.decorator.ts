import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt.auth.gurad'

export const Auth = () => UseGuards(JwtAuthGuard)
