import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Reservation from './reservation.js'
import Article from './articles.js'

export default class ReservationItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare reservationId: number // clé étrangère vers reservation

  @column()
  declare articleId: number // si un article lié

  @column()
  declare size: string

  @column()
  declare quantity: string

  @belongsTo(() => Reservation)
  declare reservation?: any

   @belongsTo(() => Article)
  declare article: BelongsTo<typeof Article>
}
