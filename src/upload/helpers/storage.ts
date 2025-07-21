import { diskStorage } from 'multer'
import { extname } from 'path'

export const storage = diskStorage({
	destination: './uploads/images',
	filename: (_req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(null, uniqueSuffix + extname(file.originalname))
	}
})

export const imageFileFilter = (
	_req: any,
	file: Express.Multer.File,
	cb: Function
) => {
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('Only image files are allowed!'), false)
	}
	cb(null, true)
}
