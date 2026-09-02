import axios from 'axios'
import * as cheerio from 'cheerio'

export interface FfbbMatch {
  numero: string
  journee: string
  date: string
  lieu: string
  equipe: string
  scoreExt: string
  scoreBBC: string
  img: string
}

export default class FfbbCalendarScrapService {
  public async getCalendar(codeTeam: string): Promise<FfbbMatch[]> {
    if (!codeTeam) throw new Error('code team manquant ou URL invalide')

    const url =
      'https://competitions.ffbb.com/ligues/nor/comites/0014/clubs/nor0014052/equipes/' + codeTeam
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    })

    const html = response.data

    // const index = html.indexOf('11h00')

    // console.log('Position 11h00:', index)

    // if (index !== -1) {
    //   console.log(html.substring(index - 500, index + 500))
    // }

    // const index10 = html.indexOf('10h00')

    // console.log('Position 10h00:', index10)

    // console.log('Date HTTP:', response.headers.date)
    // console.log('Timezone process:', Intl.DateTimeFormat().resolvedOptions().timeZone)
    // console.log('Date locale:', new Date().toString())
    // console.log('Date ISO:', new Date().toISOString())

    // console.log('Contient 10h00 ?', html.includes('10h00'))
    // console.log('Contient 11h00 ?', html.includes('11h00'))

    const $ = cheerio.load(html)
    const matches: FfbbMatch[] = []

    // Tous les div descendants de #calendar qui semblent être des matchs
    $('#calendar')
      .find('div.bg-white')
      .each((_, matchDiv) => {
        const $match = $(matchDiv)

        // Vérifier si c'est vraiment un match
        const hasNumero = $match.find('div.font-AgencyFBBlackComp').length > 0
        const hasEquipe = $match.find('a > div.line-clamp-2').length > 0
        if (!hasNumero || !hasEquipe) return

        console.log('')

        // Bloc infos principales (#numero, Jn, date, lieu)
        const infoBloc = $match.find('div.flex.gap-1.items-center').first()
        const numero = infoBloc.children('div').eq(0).text().trim()
        const journee = infoBloc.children('div').eq(1).text().trim()
        const date = infoBloc.children('div').eq(2).text().trim()
        const lieu = infoBloc.children('div').last().text().trim() // uniquement Domicile/Extérieur

        console.log('variable date' + date)
        // Équipe et image
        const equipe = $match.find('a > div.line-clamp-2').first().text().trim()
        const img = $match.find('a img').first().attr('src') || ''

        // Scores
        let scoreExt = ''
        let scoreBBC = ''
        $match.find('span').each((_, span) => {
          const $span = $(span)
          const text = $span.text().trim()
          const colorClass = $span.attr('class') || ''

          if (text) {
            if (colorClass.includes('text-[#8A8FA2]')) {
              scoreExt = text
            } else {
              scoreBBC = text
            }
          }
        })

        matches.push({ numero, journee, date, lieu, equipe, scoreExt, scoreBBC, img })
      })

    return matches
  }
}
