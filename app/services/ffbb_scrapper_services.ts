import axios from 'axios'
import * as cheerio from 'cheerio'

export interface TeamFfbb {
  nom: string
  lien: string
  image?: string
  tabData: any
}

export default class FfbbScrapService {
  async getTeam(clubUrl: string): Promise<TeamFfbb[]> {
    const { data: html } = await axios.get(clubUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    })

    const $ = cheerio.load(html)
    const teams: TeamFfbb[] = []

    //selecteur
    //check les lien avec le bon club code puis recup leurs span et leurs images
    //syntax jquery avec cheerio
    const CLUB_CODE = '/nor0014052'

    $('a').each((_, element) => {
      const link = $(element)
      const spanList = link
        .find('span')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter(Boolean)
      const href = link.attr('href')
      const img = link.find('img').first().attr('src')

      //fait un tri avec les resultats qui on un nom et qui coresspondent au club name avant de nettoyer le tabdata
      if (href && href.includes(CLUB_CODE) && spanList[0]) {
        teams.push({
          nom: spanList[0],
          lien: `https://competitions.ffbb.com${href}`,
          image: img,
          tabData: spanList
            .slice(1)
            .filter((text) => text.includes('|'))
            .map((text) => text.replace('|', '').trim()),
        })
      }
    })

    //elimine les doublons
    const uniqueTeams = new Map()
    teams.forEach((team) => {
      uniqueTeams.set(team.lien, team)
    })

    return Array.from(uniqueTeams.values())
  }
}
