import {
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { imageFileFilter, storage } from './helpers/storage'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post('image')
	@Auth()
	@UseInterceptors(
		FileInterceptor('file', {
			storage,
			fileFilter: imageFileFilter,
			limits: { fileSize: 2 * 1024 * 1024 }
		})
	)
	uploadImage(@UploadedFile() file: Express.Multer.File) {
		return this.uploadService.saveFile(file)
	}

	@Delete(':id')
	@Auth()
	async deleteImage(@Param('id') id: string) {
		return this.uploadService.deleteFile(id)
	}

	@Patch(':id')
	@Auth()
	@UseInterceptors(
		FileInterceptor('file', {
			storage,
			fileFilter: imageFileFilter,
			limits: { fileSize: 2 * 1024 * 1024 }
		})
	)
	updateImage(
		@Param('id') id: string,
		@UploadedFile() file: Express.Multer.File
	) {
		return this.uploadService.updateFile(id, file)
	}
}
