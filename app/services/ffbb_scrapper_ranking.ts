import axios from 'axios'
import * as cheerio from 'cheerio'

export default class FfbbRankingScrapService {
  public async getRanking(codeTeam: string) {
    if (!codeTeam) throw new Error('code team manquant ou URL invalide')

    const url =
      'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052/equipes/' +
      codeTeam +
      '/classement'
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    const $ = cheerio.load(html)
    const ranking: any[] = []

    $('tbody tr').each((_, tr) => {
      const tds = $(tr).find('td')
      if (tds.length < 11) return

      const position = $(tds[0]).find('span').first().text().trim()
      const logo = $(tds[0]).find('img').attr('src') || null
      const equipe = $(tds[1]).text().trim()

      const played = $(tds[3])
        .find('div.flex')
        .children('div')
        .map((_, d) => $(d).text().trim())
        .get()

      const [joues = '0', gagnes = '0', perdus = '0', nuls = '0'] = played

      const diffPoints = $(tds[10])
        .find('div.flex')
        .children('div')
        .map((_, d) => $(d).text().trim())
        .get()

      const [scored = '0', taked = '0', differential = '0'] = diffPoints

      const points = $(tds[2]).text().trim()

      ranking.push({
        position,
        equipe,
        logo,
        points,
        joues,
        gagnes,
        perdus,
        nuls,
        scored,
        taked,
        differential,
      })
    })

    return ranking
  }
}
