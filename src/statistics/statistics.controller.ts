import { Controller, Get } from '@nestjs/common'
import { StatisticsService } from './statistics.service'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('visitors')
	async getVisitorsStats() {
		return this.statisticsService.getVisitorsStats()
	}

	@Get('most-viewed')
	async getMostViewed() {
		return this.statisticsService.getMostViewedPosts()
	}

	@Get('most-liked')
	async getMostLiked() {
		return this.statisticsService.getMostLikedPosts()
	}
}
