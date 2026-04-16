import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async show({ view }: HttpContext) {
    return view.render('pages/admin/board')
  }
}
