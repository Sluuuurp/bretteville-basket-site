import type { HttpContext } from '@adonisjs/core/http'
import Reservation from '#models/reservation'
import { randomUUID } from 'node:crypto'
import Article from '#models/articles'
import { storeReservationValidator } from '#validators/reservation'

export default class ReservationsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    const articlesList = await Article.all()
    return view.render('pages/reservations/create', { articlesList })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const checkData = await request.validateUsing(storeReservationValidator)

    if (!checkData.items || checkData.items.length === 0) {
      session.flash('error', 'Vous devez réserver au moins un article')
      return response.redirect().back()
    }

    //les coordonnées
    const reservation = await Reservation.create({
      firstname: checkData.firstname,
      lastname: checkData.lastname,
      email: checkData.email,
      phone: checkData.phone || null,
      status: 'pending',
      token: randomUUID(), // pour lien unique si nécessaire
    })

    //les items
    for (const item of checkData.items) {
      await reservation.related('reservationItems').create({
        articleId: Number(item.articleId), // cast en number
        size: item.size,
        quantity: Number(item.quantity),
      })
    }

    session.flash('success', 'Réservation enregistrée !')
    return response.redirect('back')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

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
