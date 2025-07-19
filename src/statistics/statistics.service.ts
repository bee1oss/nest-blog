import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { subDays, format } from 'date-fns'

@Injectable()
export class StatisticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getVisitorsStats() {
		const total = await this.prisma.view.count()

		const today = new Date()
		const sevenDaysAgo = subDays(today, 6)

		const grouped = await this.prisma.view.groupBy({
			by: ['createdAt'],
			where: {
				createdAt: {
					gte: sevenDaysAgo
				}
			},
			orderBy: {
				createdAt: 'asc'
			},
			_count: true
		})

		// Tarihlere göre grupla
		const daily = grouped.map(entry => ({
			date: format(entry.createdAt, 'yyyy-MM-dd'),
			count: entry._count
		}))

		return {
			total,
			daily
		}
	}

	async getMostViewedPosts(limit = 5) {
		return this.prisma.post.findMany({
			take: limit,
			orderBy: {
				views: {
					_count: 'desc'
				}
			},
			include: {
				views: true,
				author: true
			}
		})
	}

	async getMostLikedPosts(limit = 5) {
		return this.prisma.post.findMany({
			take: limit,
			orderBy: {
				likes: {
					_count: 'desc'
				}
			},
			include: {
				likes: true,
				author: true
			}
		})
	}
}
