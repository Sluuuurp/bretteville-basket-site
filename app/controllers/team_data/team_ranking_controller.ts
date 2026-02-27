import FfbbRankingScrapService from '#services/ffbb_scrapper_ranking'
import type { HttpContext } from '@adonisjs/core/http'
import FfbbScrapService from '#services/ffbb_scrapper_services'

export default class TeamRankingController {
  public async show({ params, view }: HttpContext) {
    const codeTeam = params.codeteam

    const scraperTeam = new FfbbScrapService()

    const teamsList = await scraperTeam.getTeam(
      'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
    )

    if (!codeTeam) {
    }

    const scraperRanking = new FfbbRankingScrapService()
    const ranking = await scraperRanking.getRanking(codeTeam)
    const currentTeam = ranking.find((team) => team.equipe.toLowerCase().includes('bretteville'))

    return view.render('pages/teams/ranking', {
      ranking: ranking,
      team: teamsList,
      currentTeam: currentTeam,
    })
  }
}
