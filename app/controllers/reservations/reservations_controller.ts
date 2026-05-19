import type { HttpContext } from '@adonisjs/core/http'
import Reservation from '#models/reservation'
import { randomUUID } from 'node:crypto'
import Article from '#models/articles'
import { storeReservationValidator } from '#validators/reservation'
import mail from '@adonisjs/mail/services/main'

export default class ReservationsController {
  /**
   * Display a list of resource
   */
  async index({ view, request }: HttpContext) {
    const search = request.input('search')
    const status = request.input('status')
    const product = request.input('product')
    const articles = await Article.all()

    let query = Reservation.query()
      .preload('reservationItems', (query) => {
        query.preload('article')
      })
      .orderBy('createdAt', 'desc')

    // recherche nom / email
    if (search) {
      query.where((builder) => {
        builder.whereILike('firstname', `%${search}%`).orWhereILike('lastname', `%${search}%`).orWhereILike('email', `%${search}%`)
      })
    }

    // filtre statut
    if (status) {
      query.where('status', status)
    }

    const reservations = await query

    // filtre produit (après preload)
    const filteredReservations = product
      ? reservations.filter((reservation) =>
          reservation.reservationItems.some((item) => item.article?.name === product)
        )
      : reservations

    return view.render('pages/reservations/index', {
      reservations: filteredReservations, articles
    })
  }

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
    try {
      const checkData = await request.validateUsing(storeReservationValidator)

      if (!checkData.items || checkData.items.length === 0) {
        session.flash('error', 'Vous devez réserver au moins un article')
        return response.redirect().back()
      }

      // Les coordonnées
      const reservation = await Reservation.create({
        firstname: checkData.firstname,
        lastname: checkData.lastname,
        email: checkData.email,
        phone: checkData.phone || null,
        status: 'reservé',
        token: randomUUID(), // pour lien unique si nécessaire
      })

      // Les items
      for (const item of checkData.items) {
        await reservation.related('reservationItems').create({
          articleId: Number(item.articleId), // cast en number
          size: item.size,
          quantity: Number(item.quantity),
        })
      }

      const itemsWithArticles = await Promise.all(
        checkData.items.map(async (item) => {
          const article = await Article.find(item.articleId)

          return {
            articleName: article?.name || 'Article inconnu',
            size: item.size,
            quantity: item.quantity,
          }
        })
      )

      await mail.send((message) => {
        message.to('ton-mail-club@mail.fr').subject('Nouvelle réservation Bretteville Basket')
          .html(`
      <h2>Nouvelle réservation</h2>

      <p><strong>Nom :</strong> ${checkData.firstname} ${checkData.lastname}</p>
      <p><strong>Email :</strong> ${checkData.email}</p>
      <p><strong>Téléphone :</strong> ${checkData.phone || 'Non renseigné'}</p>

      <h3>Articles réservés</h3>

      <ul>
        ${itemsWithArticles
          .map(
            (item) => `
              <li>
                <strong>${item.articleName}</strong><br>
                Taille : ${item.size}<br>
                Quantité : ${item.quantity}
              </li>
            `
          )
          .join('')}
      </ul>

      <p><strong>Token :</strong> ${reservation.token}</p>
    `)
      })

      session.flash('success', 'Réservation enregistrée !')
      return response.redirect('back')
    } catch (error) {
      if (error.messages) {
        // Récupère toutes les erreurs Vine et les envoie au front
        session.flash('errors', error.messages)
      }
      return response.redirect('back')
    }
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
  // async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response, session }: HttpContext) {
    const reservation = await Reservation.findOrFail(params.id)

    // Supprime les items liés
    await reservation.related('reservationItems').query().delete()

    // Supprime la réservation
    await reservation.delete()

    session.flash('success', 'Réservation supprimée !')

    return response.redirect().back()
  }

  async updateStatus({ params, request, response, session }: HttpContext) {
    const reservation = await Reservation.findOrFail(params.id)

    reservation.status = request.input('status')

    await reservation.save()

    session.flash('success', 'Statut mis à jour')

    return response.redirect().back()
  }
}
