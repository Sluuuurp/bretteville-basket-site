import FfbbRankingScrapService from '#services/ffbb_scrapper_ranking'
import type { HttpContext } from '@adonisjs/core/http'
import FfbbScrapService from '#services/ffbb_scrapper_services'
import CacheScrapService from '#services/cache_scrapper'

export default class TeamRankingController {
  public async show({ params, view }: HttpContext) {
    const codeTeam = params.codeteam

    const teamsList = await CacheScrapService.get('teams_list', async () => {
      const scraperTeam = new FfbbScrapService()
      return await scraperTeam.getTeam(
        'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
      )
    })

    const currentTeam = teamsList.find((team: any) => team.lien.includes(codeTeam))
    const gender = currentTeam?.tabData[0].includes('M') ? 'M' : 'F'

    if (!codeTeam) {
    }

    const ranking = await CacheScrapService.get(`ranking_${codeTeam}`, async () => {
      const scraperRanking = new FfbbRankingScrapService()
      return await scraperRanking.getRanking(codeTeam)
    })

    return view.render('pages/teams/ranking', {
      ranking: ranking,
      team: teamsList,
      currentTeam: currentTeam,
      gender: gender,
    })
  }
}
