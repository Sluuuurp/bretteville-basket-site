import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservation_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('reservation_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('reservations')
        .onDelete('CASCADE')

      table.integer('article_id').unsigned().notNullable().references('id').inTable('articles')

      table.string('size').notNullable()
      table.integer('quantity').unsigned().notNullable()

      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
