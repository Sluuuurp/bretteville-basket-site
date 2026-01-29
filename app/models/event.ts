import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare title: string

  @column()
  declare content: string | null

  @column({
    prepare: (value: { path: string; alt?: string }[]) => JSON.stringify(value || []),
    consume: (value: string | { path: string; alt?: string }[] | null) => {
      if (!value) return [] // null ou vide
      if (Array.isArray(value)) return value // déjà un tableau JS
      try {
        return JSON.parse(value) // sinon parse la chaîne JSON
      } catch {
        return [] // fallback si corrompu
      }
    },
  })
  declare images: { path: string; alt?: string }[]
}
