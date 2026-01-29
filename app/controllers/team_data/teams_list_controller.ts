import type { HttpContext } from '@adonisjs/core/http'
import FfbbScrapService from '#services/ffbb_scrapper_services'

export default class TeamsListController {
  public async show({ view }: HttpContext) {
    const scraper = new FfbbScrapService()

    const teams = await scraper.getTeam(
      'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
    )

    // Ici on rend la page Edge et on passe les données
    return view.render('pages/teams/index', { teams })
  }
}
