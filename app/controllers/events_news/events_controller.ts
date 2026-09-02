import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs'
import { storeEventsValidator, updateEventsValidator } from '#validators/event'
import Event from '#models/event'
import app from '@adonisjs/core/services/app'
import ImageService from '#services/image_compression'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'

export default class EventsController {
  /**
   * Display a list of resource
   */
  async index({ view, auth }: HttpContext) {
    const eventList = await Event.query().orderBy('created_at', 'desc')
    await auth.check()
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
    try {
      console.log(request.files('images'))

      console.log(request.all())
      console.log(typeof request.input('content'))
      console.log(request.input('content')?.length)

      // validation
      const checkData = await request.validateUsing(storeEventsValidator)

      const event = await Event.create({
        title: checkData.title,
        content: checkData.content,
      })

      //  Gerer les images
      const images: { path: string; alt?: string }[] = []

      if (checkData.images && checkData.images.length > 0) {
        for (const image of checkData.images) {
          const path = await ImageService.processAndSave(image, 'uploads/events')

          images.push({ path, alt: '' })
        }
      }

      event.images = images
      await event.save()

      session.flash('success', 'Événement créé !')

      return response.redirect('/evenements')
    } catch (error) {
      if (error.messages) {
        // Recup toutes les erreurs Vine et les envoie à la vue
        session.flash('errors', error.messages)
      }
      return response.redirect('back')
    }
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
    try {
      const event = await Event.findOrFail(params.id)

      // validation
      const checkData = await request.validateUsing(updateEventsValidator)

      event.title = checkData.title
      event.content = checkData.content ?? null

      let images = event.images ?? []

      // supprimer images
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

      // nouvelles images
      const uploadedImages = checkData.images || []

      for (const image of uploadedImages) {
        const path = await ImageService.processAndSave(image, 'uploads/events')

        images.push({ path, alt: '' })
      }

      event.images = images
      await event.save()

      session.flash('success', 'Événement Modifié !')
      return response.redirect('/evenements')
    } catch (error) {
      if (error.messages) {
        // Récupère toutes les erreurs Vine et les envoie à la vue
        session.flash('errors', error.messages)
      }
      return response.redirect('back')
    }
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

    //  Supprimer l'evenement
    await event.delete()

    // Flash et redirect
    session.flash('success', 'Événement supprimé !')
    return response.redirect('/evenements')
  }
}
