import type { HttpContext } from '@adonisjs/core/http'
import FfbbScrapService from '#services/ffbb_scrapper_services'
import CacheScrapService from '#services/cache_scrapper'

export default class TeamsListController {
  public async show({ request, view }: HttpContext) {
    const scraper = new FfbbScrapService()

    // const teams = await scraper.getTeam(
    //   'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
    // )

    const teams = await CacheScrapService.get('teams_list', async () => {
      return await scraper.getTeam(
        'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
      )
    })

    const gender = request.input('gender') || 'M' // mon M ou F
    const teamsFiltered = teams.filter((team: any) => team.tabData[0].includes(gender))
    // Ici on rend la page Edge et on passe les données

    if (request.input('gender')) {
      // Si c'est un fetch AJAX, on retourne **la partielle uniquement**
      return view.render('components/teams-list', { teams: teamsFiltered, gender })
    }

    // Sinon on retourne la page complète
    return view.render('pages/teams/index', { teams: teamsFiltered })
  }
}
