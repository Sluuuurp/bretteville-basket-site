import type { HttpContext } from '@adonisjs/core/http'
import FfbbCalendarScrapService from '#services/ffbb_scrapper_calendar'
import CacheScrapService from '#services/cache_scrapper'

export default class CalendarsController {
  public async show({ request, response }: HttpContext) {
    const codeTeam = request.input('codeteam')

    if (!codeTeam) {
      return response.badRequest({ error: 'code equipe manquant' })
    }

    // const scraper = new FfbbCalendarScrapService()
    // const calendar = await scraper.getCalendar(codeTeam)

    const calendar = await CacheScrapService.get(`calendar_${codeTeam}`, async () => {
      const scraperRanking = new FfbbCalendarScrapService()
      return await scraperRanking.getCalendar(codeTeam)
    })

    return response.json({
      calendar,
    })
  }
}
