import type { HttpContext } from '@adonisjs/core/http'
import TournamentRegistration from '#models/tournament_registration'
import { storeTournamentRegistrationValidator } from '#validators/tournament_registration'

export default class TournamentRegistrationsController {
  public async store({ request, response, session }: HttpContext) {
    console.log(request.body())
    try {
      // ✅ Validation Vine
      const payload = await request.validateUsing(storeTournamentRegistrationValidator)

      // ✅ Création en base
      const registration = await TournamentRegistration.create({
        clubNom: payload.club.nom,
        correspondant: payload.club.correspondant,
        telephone: payload.club.telephone,
        email: payload.club.email,

        u11F: payload.equipes.u11f,
        u13F: payload.equipes.u13f,
        u15F: payload.equipes.u15f,
        u18G: payload.equipes.u18g,
        u18F: payload.equipes.u18f,

        repas: payload.repas,
      })

      //  OK
      response.redirect('back')
    } catch (error) {
      if (error.messages) {
        // Récupère toutes les erreurs Vine et les envoie à la vue
        session.flash('errors', error.messages)
      }
      return response.redirect('back')
    }
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/tournament_registration')
  }
}
