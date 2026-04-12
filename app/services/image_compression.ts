import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import app from '@adonisjs/core/services/app'

export default class ImageService {
  static async processAndSave(image: any, folder: string) {
    const fileName = `${randomUUID()}.webp`
    const fullPath = app.makePath(`public/${folder}/${fileName}`)

    await sharp(image.tmpPath!)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullPath)

    return `${folder}/${fileName}`
  }
}
