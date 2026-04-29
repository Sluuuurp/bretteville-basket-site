import vine from '@vinejs/vine'

export const storeTournamentRegistrationValidator = vine.compile(
  vine.object({
    club: vine.object({
      nom: vine.string().trim().minLength(1),
      correspondant: vine.string().trim().minLength(1),
      telephone: vine.string().trim().minLength(1),
      email: vine.string().email(),
    }),

    equipes: vine.object({
      u11f: vine.number().min(0).max(5),
      u13f: vine.number().min(0).max(5),
      u15f: vine.number().min(0).max(5),
      u18g: vine.number().min(0).max(5),
      u18f: vine.number().min(0).max(5),
    }),
    repas: vine.string().trim().minLength(1),
  })
)
