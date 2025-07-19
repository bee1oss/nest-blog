import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { CsrfMiddleware } from './auth/middleware/csrf.middleware'
import { RefreshtokenModule } from './refreshtoken/refreshtoken.module'
import { PostModule } from './post/post.module'
import { StatisticsModule } from './statistics/statistics.module'
import { APP_GUARD } from '@nestjs/core'

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 10000,
					limit: 3
				}
			]
		}),
		RefreshtokenModule,
		PostModule,
		StatisticsModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CsrfMiddleware).forRoutes({
			path: 'protected-route/*path',
			method: RequestMethod.ALL
		})
	}
}
