import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tournament_registrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      //infos club
      table.string('club_nom').notNullable()
      table.string('correspondant').notNullable()
      table.string('telephone').notNullable()
      table.string('email').notNullable()

      //Catégories
      table.integer('u_11_f').defaultTo(0)
      table.integer('u_13_f').defaultTo(0)
      table.integer('u_15_f').defaultTo(0)
      table.integer('u_18_g').defaultTo(0)
      table.integer('u_18_f').defaultTo(0)

      //repas
      table.text('repas').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
