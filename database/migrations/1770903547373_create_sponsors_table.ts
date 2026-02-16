import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sponsors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.string('nom_ent').notNullable
      table.string('ville').notNullable
      table.string('lien').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
