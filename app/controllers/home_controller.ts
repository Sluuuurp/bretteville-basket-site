import Sponsor from '#models/sponsor'
import Event from '#models/event'
import fs from 'node:fs/promises'
import path from 'node:path'
import CacheScrapService from '#services/cache_scrapper'
import FfbbScrapService from '#services/ffbb_scrapper_services'
import FfbbCalendarScrapService from '#services/ffbb_scrapper_calendar'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ view }: HttpContext) {
    const lastEvent = await Event.query().orderBy('created_at', 'desc').first()
    const sponsors = await Sponsor.all()
    //table arbitre
    const filePath = path.join(process.cwd(), 'public/uploads/referee-table.txt')
    let refTable = ''

    try {
      refTable = await fs.readFile(filePath, 'utf-8')
    } catch (e) {
      refTable = 'Fichier non trouve'
    }

    let cleanMatches = []

    try {
      cleanMatches = await CacheScrapService.get('last_matches', async () => {
        const scraperTeam = new FfbbScrapService()
        const teamsList = await scraperTeam.getTeam(
          'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052'
        )

        const scraperMatch = new FfbbCalendarScrapService()

        const lastMatchesPerTeam = await Promise.all(
          teamsList.map(async (team) => {
            try {
              const codeTeam = team.lien.split('/equipes/')[1]

              const matches = await scraperMatch.getCalendar(codeTeam)

              const lastMatch = matches.filter((m) => m.scoreBBC !== '' && m.scoreExt !== '0').pop()

              if (!lastMatch) return null

              return {
                ...lastMatch,
                teamBBC: team.nom,
              }
            } catch (e) {
              console.error('Erreur équipe', team.nom, e)
              return null
            }
          })
        )

        return lastMatchesPerTeam.filter(Boolean)
      })
    } catch (error) {
      console.error('Erreur globale scrap', error)
      cleanMatches = [] // fallback safe
    }

    return view.render('pages/home', {
      refTable,
      sponsors,
      lastEvent,
      cleanMatches,
    })
  }
}
