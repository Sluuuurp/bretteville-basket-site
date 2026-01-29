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
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: any) => (value ? JSON.parse(value) : []),
  })
  declare images: { path: string; alt?: string }[]
}
