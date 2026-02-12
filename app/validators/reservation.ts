import vine from '@vinejs/vine'

export const storeReservationValidator = vine.compile(
  vine.object({
    firstname: vine.string().maxLength(100),
    lastname: vine.string().maxLength(100),
    email: vine.string().email(),
    phone: vine.string().maxLength(20).optional(),

    items: vine
      .array(
        vine.object({
          articleId: vine.number(), // ID de l'article
          size: vine.enum(['S', 'M', 'L', 'XL']),
          quantity: vine.number().min(1),
        })
      )
      .optional()
      .nullable(), // au moins un article
  })
)

//le probleme c'est que le validator attend le champ item, meme vide
//sauf que si il existe juste pas il plante
