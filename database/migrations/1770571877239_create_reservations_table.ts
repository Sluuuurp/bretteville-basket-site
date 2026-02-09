import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamps(true)
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('email', 254).notNullable()
      table.string('phone').nullable()

      table.string('status').notNullable().defaultTo('pending')
      table.uuid('token').notNullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
