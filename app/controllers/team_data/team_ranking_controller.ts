import FfbbRankingScrapService from '#services/ffbb_scrapper_ranking'
import type { HttpContext } from '@adonisjs/core/http'

export default class TeamRankingController {
  public async show({ request, response }: HttpContext) {
    const codeTeam = request.input('codeteam')

    if (!codeTeam) {
      return response.badRequest({ error: 'code equipe manquant' })
    }

    const scraper = new FfbbRankingScrapService()
    const ranking = await scraper.getRanking(codeTeam)
    return response.json({
      ranking,
    })
  }
}
