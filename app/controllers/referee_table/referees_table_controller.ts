import fs from 'node:fs/promises'
import path from 'node:path'
import type { HttpContext } from '@adonisjs/core/http'

export default class RefereesTableController {
  //chemin du fichier
  filePath = path.join(process.cwd(), 'public/uploads/referee-table.txt')

  //affichage
  async show({ view }: HttpContext) {
    let content = ''

    try {
      content = await fs.readFile(this.filePath, 'utf-8')
    } catch (e) {
      content = 'Fichier non trouve'
    }

    return view.render('pages/referee_table/show', { content })
  }

  //form edition
  async edit({ view }: HttpContext) {
    let content = ''

    try {
      content = await fs.readFile(this.filePath, 'utf-8')
    } catch (e) {
      content = 'Fichier non trouve'
    }

    return view.render('pages/referee_table/edit', { content })
  }

  //update
  async update({ request, response, session }: HttpContext) {
    const content = request.input('content')
    console.log(content)

    try {
      await fs.writeFile(this.filePath, content, 'utf-8')
      session.flash('success', 'Sauvegarde effectue')
    } catch (error) {
      session.flash('error', 'Echec de la sauvegarde')
    }

    return response.redirect().back()
  }
}
