import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { slugify } from './utils/slugify'

@Injectable()
export class PostService {
	constructor(private prisma: PrismaService) {}

	/* ------------ Like ve View icin ---------- */

	async getViewCount(postId: string) {
		return this.prisma.view.count({
			where: {
				postId
			}
		})
	}

	async getLikeCount(postId: string) {
		return this.prisma.like.count({
			where: {
				postId
			}
		})
	}

	async addLike(postId: string, ip: string) {
		const existing = await this.prisma.like.findUnique({
			where: {
				postId_ip: {
					postId,
					ip
				}
			}
		})

		if (existing) {
			throw new BadRequestException('Bu post zaten beğenildi.')
		}

		await this.prisma.like.create({
			data: {
				postId,
				ip
			}
		})
	}

	async addView(postId: string, ip: string) {
		const existing = await this.prisma.view.findFirst({
			where: {
				postId,
				ip
			}
		})

		if (!existing) {
			await this.prisma.view.create({
				data: {
					postId,
					ip
				}
			})
		}
	}

	async getAll(searchTerm?: string) {
		if (searchTerm) return this.getSearchFilterPosts(searchTerm)

		return this.prisma.post.findMany({
			where: { isPublished: true },
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				tags: true,
				author: true
			}
		})
	}

	private async getSearchFilterPosts(searchTerm: string) {
		return this.prisma.post.findMany({
			where: {
				isPublished: true,
				OR: [
					{
						title: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						summary: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					},
					{
						content: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				]
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				tags: true,
				author: true
			}
		})
	}

	async getById(postId: string) {
		const post = await this.prisma.post.findUnique({
			where: { id: postId },
			include: {
				tags: true,
				author: true,
				likes: true,
				views: true
			}
		})
		if (!post) throw new NotFoundException('Post not found')

		return post
	}

	//slug uzerinden erisim dah cok seo uymludur
	async getBySlug(slug: string) {
		const post = await this.prisma.post.findUnique({
			where: { slug },
			include: {
				tags: true,
				author: {
					select: {
						id: true,
						name: true,
						picture: true
					}
				}
			}
		})

		if (!post) throw new NotFoundException('Yazı bulunamadı')

		return post
	}
	//frontend de auto complate icin kullanilir
	async getAllTags() {
		return this.prisma.tag.findMany({
			orderBy: { name: 'asc' }
		})
	}

	async publish(id: string) {
		return this.prisma.post.update({
			where: { id },
			data: { isPublished: true }
		})
	}

	async create(dto: CreatePostDto, userId: string) {
		const slug = dto.slug?.trim() || slugify(dto.title)

		return this.prisma.post.create({
			data: {
				title: dto.title,
				slug,
				summary: dto.summary,
				content: dto.content,
				authorId: userId,
				tags: dto.tags
					? {
							connectOrCreate: dto.tags.map(name => ({
								where: { name },
								create: { name }
							}))
						}
					: undefined
			}
		})
	}

	async update(id: string, dto: CreatePostDto) {
		await this.getById(id)

		return this.prisma.post.update({
			where: { id },
			data: {
				title: dto.title,
				slug: dto.slug,
				summary: dto.summary,
				content: dto.content,
				metaTitle: dto.metaTitle,
				metaDescription: dto.metaDescription,
				coverImage: dto.coverImage,
				tags: dto.tags
					? {
							connectOrCreate: dto.tags.map(name => ({
								where: { name },
								create: { name }
							}))
						}
					: undefined
			}
		})
	}

	async delete(id: string) {
		await this.getById(id)

		return this.prisma.post.delete({
			where: { id }
		})
	}
}
