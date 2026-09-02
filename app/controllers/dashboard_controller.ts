import type { HttpContext } from '@adonisjs/core/http'
import Reservation from '#models/reservation'

export default class DashboardController {
  async show({ view }: HttpContext) {

    const reservations = await Reservation.query().preload('reservationItems', (query) => {
      query.preload('article')
    })

    const sizeSummary = {}

    reservations.forEach((reservation) => {
      reservation.reservationItems.forEach((item) => {
        const articleName = item.article?.name
        const size = item.size
        const quantity = item.quantity

        if (!sizeSummary[articleName]) {
          sizeSummary[articleName] = {}
        }

        if (!sizeSummary[articleName][size]) {
          sizeSummary[articleName][size] = 0
        }

        sizeSummary[articleName][size] += quantity
      })
    })

    return view.render('pages/admin/board',{sizeSummary: Object.entries(sizeSummary),})
  }
  
}
