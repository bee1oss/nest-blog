import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { CsrfMiddleware } from './auth/middleware/csrf.middleware'
import { RefreshtokenModule } from './refreshtoken/refreshtoken.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000,
					limit: 10
				}
			]
		}),
		RefreshtokenModule
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(CsrfMiddleware)
			.forRoutes({
				path: 'protected-route/*path',
				method: RequestMethod.ALL
			})
	}
}
