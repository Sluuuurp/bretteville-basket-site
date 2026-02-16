import vine from '@vinejs/vine'

export const storeSponsorValidator = vine.compile(
  vine.object({
    nom_ent: vine.string().maxLength(100),
    ville: vine.string().maxLength(100),
    lien: vine.string().url().optional(),
  })
)

export const updateSponsorValidator = vine.compile(
  vine.object({
    nom_ent: vine.string().maxLength(100),
    ville: vine.string().maxLength(100),
    lien: vine.string().url().optional(),
  })
)
