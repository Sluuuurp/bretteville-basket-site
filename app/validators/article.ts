import vine from '@vinejs/vine'

export const storeArticlesValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(250),

    description: vine.string().maxLength(400).optional(),

    price: vine
      .number()
      .min(0)
      .max(999999)
      .transform((value) => Math.round(value * 100) / 100), //bloque les 10.9999

    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    }),
  })
)

export const updateArticlesValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(250),

    description: vine.string().maxLength(400).optional(),

    price: vine
      .number()
      .min(0)
      .max(999999)
      .transform((value) => Math.round(value * 100) / 100), //bloque les 10.9999

    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      })
      .optional(),
  })
)
