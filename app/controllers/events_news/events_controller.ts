import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs'
import { storeEventsValidator, updateEventsValidator } from '#validators/event'
import Event from '#models/event'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const eventList = await Event.query().orderBy('created_at', 'desc')
    return view.render('pages/events_news/index', { eventList })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('pages/events_news/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const checkData = await request.validateUsing(storeEventsValidator)

    const event = await Event.create({
      title: checkData.title,
      content: checkData.content,
    })

    // 3️⃣ Gérer les images
    const images: { path: string; alt?: string }[] = []

    if (checkData.images && checkData.images.length > 0) {
      for (const image of checkData.images) {
        const ext = image.extname ?? 'jpg'
        const fileName = `${event.id}-${randomUUID()}.${ext}`

        await image.move(app.makePath('public/uploads/events'), { name: fileName })

        images.push({ path: `uploads/events/${fileName}`, alt: '' }) // alt optionnel
      }
    }

    event.images = images
    await event.save()

    session.flash('success', 'Événement créé !')

    return response.redirect('/evenements')
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const event = await Event.findOrFail(params.id)

    return view.render('pages/events_news/show', { event })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const event = await Event.findOrFail(params.id)

    return view.render('pages/events_news/edit', { event })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)

    //validation
    const checkData = await request.validateUsing(updateEventsValidator)

    event.title = checkData.title
    event.content = checkData.content ?? null

    let images = event.images ?? []

    //supprimer images
    const removeImages = checkData.removeImages || []
    for (const imgPath of removeImages) {
      // Supprimer le fichier du disque
      const filePath = join(app.publicPath(''), imgPath)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (err) {
        console.error('Erreur suppression image:', filePath, err)
      }
    }

    images = images.filter((img) => !removeImages.includes(img.path))

    //nouvelle images
    const uploadedImages = checkData.images || []
    for (const file of uploadedImages) {
      await file.move(app.publicPath('uploads/events'))

      images.push({
        path: `uploads/events/${file.fileName}`,
      })
    }

    event.images = images
    await event.save()

    session.flash('success', 'Événement Modifié !')
    return response.redirect('/evenements')
  }

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const event = await Event.findOrFail(params.id)

    //fs verifie si le fichier existe et le supprime
    for (const image of event.images) {
      const filePath = join(app.publicPath(''), image.path)
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (err) {
        console.error('Erreur suppression image:', filePath, err)
      }
    }

    // 2️⃣ Supprimer l’événement
    await event.delete()

    // 3️⃣ Flash + redirect
    session.flash('success', 'Événement supprimé !')
    return response.redirect('/evenements')
  }
}
