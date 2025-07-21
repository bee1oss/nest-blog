import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { PostService } from './post.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { CurrentUser } from 'src/user/decorators/user.decorator'
import { Request } from 'express'

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get(':id/view-count')
	@HttpCode(200)
	async getViewCount(@Param('id') id: string) {
		const count = await this.postService.getViewCount(id)
		return { count }
	}

	@Get(':id/like-count')
	@HttpCode(200)
	async getLikeCount(@Param('id') id: string) {
		const count = await this.postService.getLikeCount(id)
		return { count }
	}

	@Post(':id/like')
	@HttpCode(200)
	async addLike(@Param('id') id: string, @Req() req: Request) {
		const ip =
			(req.headers['x-forwarded-for'] as string) ||
			req.socket?.remoteAddress ||
			'unknown'

		await this.postService.addLike(id, String(ip))
		return { success: true }
	}

	@Post(':id/views')
	@HttpCode(200)
	async addView(@Param('id') id: string, @Req() req: Request) {
		const ip =
			(req.headers['x-forwarded-for'] as string) ||
			req.socket?.remoteAddress ||
			'unknown'

		await this.postService.addView(id, String(ip))
		return { success: true }
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.postService.getAll(searchTerm)
	}

	@Get(':slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.postService.getBySlug(slug)
	}

	@Patch(':id/publish')
	@Auth()
	async publish(@Param('id') id: string) {
		return this.postService.publish(id)
	}

	@Get('/tags')
	async getAllTags() {
		return this.postService.getAllTags()
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post()
	async create(
		@Body() dto: CreatePostDto,
		@CurrentUser('id') userId: string
	) {
		return this.postService.create(dto, userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: CreatePostDto) {
		return this.postService.update(id, dto)
	}

	@HttpCode(200)
	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.postService.delete(id)
	}

	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return this.postService.getById(id)
	}
}
