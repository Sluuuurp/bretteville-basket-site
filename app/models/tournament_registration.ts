import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TournamentRegistration extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // Infos club
  @column()
  declare clubNom: string

  @column()
  declare correspondant: string

  @column()
  declare telephone: string

  @column()
  declare email: string

  // Catégories
  @column()
  declare u11F: number

  @column()
  declare u13F: number

  @column()
  declare u15F: number

  @column()
  declare u18G: number

  @column()
  declare u18F: number

  // Repas
  @column()
  declare repas: string

  // Timestamps
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
