import Sponsor from '#models/sponsor'
import { storeSponsorValidator, updateSponsorValidator } from '#validators/sponsor'
import type { HttpContext } from '@adonisjs/core/http'

export default class SponsorsController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    const sponsorsList = await Sponsor.all()
    return view.render('pages/sponsors/index', { sponsorsList })
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('pages/sponsors/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const checkData = await request.validateUsing(storeSponsorValidator)

    const sponsor = await Sponsor.create({
      nom_ent: checkData.nom_ent,
      ville: checkData.ville,
      lien: checkData.lien,
    })

    await sponsor.save()

    session.flash('success', 'Sponsor créé !')

    return response.redirect('/sponsors')
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params, view }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)
    return view.render('pages/sponsors/edit', { sponsor })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)

    const checkData = await request.validateUsing(updateSponsorValidator)

    sponsor.nom_ent = checkData.nom_ent
    sponsor.ville = checkData.ville
    sponsor.lien = checkData.lien ?? null

    await sponsor.save()

    session.flash('success', 'Sponsor mis à jour !')
    return response.redirect('/sponsors')
  }

  /**
   * Delete record
   */
  async destroy({ params, session, response }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)

    await sponsor.delete()

    session.flash('success', 'Sponsor supprimé !')
    return response.redirect('/sponsors')
  }
}
