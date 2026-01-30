import type { HttpContext } from '@adonisjs/core/http'
import { storeEventsValidator } from '#validators/event'
import Event from '#models/event'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'

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

        await image.move(app.makePath('uploads/events'), { name: fileName })

        images.push({ path: `events/${fileName}`, alt: '' }) // alt optionnel
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
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
