import Sponsor from '#models/sponsor'
import Event from '#models/event'
import CacheScrapService from '#services/cache_scrapper'
import FfbbScrapService from '#services/ffbb_scrapper_services'
import FfbbCalendarScrapService from '#services/ffbb_scrapper_calendar'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view }: HttpContext) {
    const hi = 'hello there'
    const lastEvent = await Event.query().orderBy('created_at', 'desc').first()
    const sponsors = await Sponsor.all()

    const cleanMatches = await CacheScrapService.get('last_matches', async () => {
      //scrap ici

      const scraperTeam = new FfbbScrapService()
      const teamsList = await scraperTeam.getTeam(
        'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
      )

      const scraperMatch = new FfbbCalendarScrapService()

      const lastMatchesPerTeam = await Promise.all(
        teamsList.map(async (team) => {
          const codeTeam = team.lien.split('/equipes/')[1]

          const matches = await scraperMatch.getCalendar(codeTeam)

          const lastMatch = matches.filter((m) => m.scoreBBC !== '' && m.scoreExt !== '0').pop()

          if (!lastMatch) return null

          return {
            ...lastMatch,
            teamBBC: team.nom,
          }
        })
      )

      return lastMatchesPerTeam.filter(Boolean)
    })

    return view.render('pages/home', {
      hi,
      sponsors,
      lastEvent,
      cleanMatches,
    })
  }
}
