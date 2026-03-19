import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/articles'
import { storeArticlesValidator, updateArticlesValidator } from '#validators/article'
import { randomUUID } from 'node:crypto'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import fs from 'node:fs'

export default class ArticlesController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    const articlesList = await Article.all()
    await auth.check()
    return view.render('pages/articles/index', { articlesList })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('pages/articles/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    console.log(request.file('image'))
    const checkData = await request.validateUsing(storeArticlesValidator)

    // gestion image
    const imgName = `${randomUUID()}.${checkData.image.extname}`
    await checkData.image.move(app.makePath('public/uploads/articles'), { name: imgName })

    const article = await Article.create({
      name: checkData.name,
      description: checkData.description,
      price: checkData.price,
      image: `uploads/articles/${imgName}`,
    })

    await article.save()

    session.flash('success', 'Article créé !')

    return response.redirect('/articles')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    return view.render('pages/articles/edit', { article })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    //validation
    const checkData = await request.validateUsing(updateArticlesValidator)

    article.name = checkData.name
    article.description = checkData.description ?? null
    article.price = checkData.price

    //gestion image
    if (checkData.image) {
      // Supprime l’ancienne image si elle existe
      if (article.image) {
        const oldPath = join(app.publicPath(''), article.image)
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
      }

      // Déplace la nouvelle image
      const fileName = `${article.id}-${randomUUID()}.${checkData.image.extname}`
      await checkData.image.move(app.publicPath('uploads/articles'), { name: fileName })

      // Stocke le chemin relatif dans DB
      article.image = `uploads/articles/${fileName}`
    }

    await article.save()

    session.flash('success', 'Article mis à jour !')
    return response.redirect('/articles')
  }

  /**
   * Delete record
   */
  async destroy({ params, session, response }: HttpContext) {
    const article = await Article.findOrFail(params.id)

    const filePath = join(app.publicPath(''), article.image)

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (err) {
      console.error('Erreur suppression image:', filePath, err)
    }

    //Supprimer l’événement
    await article.delete()

    //Flash + redirect
    session.flash('success', 'Article supprimé !')
    return response.redirect('/articles')
  }
}
