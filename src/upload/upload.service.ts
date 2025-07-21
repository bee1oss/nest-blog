import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { Express } from 'express'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class UploadService {
	constructor(private readonly prisma: PrismaService) {}

	async saveFile(file: Express.Multer.File) {
		if (!file) throw new Error('Dosya yüklenemedi')

		const url = `/uploads/images/${file.filename}`

		const saved = await this.prisma.upload.create({
			data: {
				url,
				filename: file.filename
			}
		})

		return saved
	}

	async deleteFile(id: string) {
		const file = await this.prisma.upload.findUnique({ where: { id } })
		if (!file) throw new NotFoundException('Dosya bulunamadı')

		const filePath = path.join(
			process.cwd(),
			'public',
			'uploads',
			'images',
			file.filename
		)
		if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

		await this.prisma.upload.delete({ where: { id } })

		return { message: 'Dosya silindi' }
	}

	async updateFile(id: string, newFile: Express.Multer.File) {
		const oldFile = await this.prisma.upload.findUnique({ where: { id } })
		if (!oldFile) throw new NotFoundException('Eski dosya bulunamadı')

		// Eski dosyayı sil
		const oldPath = path.join(
			process.cwd(),
			'public',
			'uploads',
			'images',
			oldFile.filename
		)
		if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)

		// Yeni dosyayı kaydet
		const url = `/uploads/images/${newFile.filename}`

		const updated = await this.prisma.upload.update({
			where: { id },
			data: {
				filename: newFile.filename,
				url
			}
		})

		return updated
	}
}
