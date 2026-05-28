import vine from '@vinejs/vine'

export const storeEventsValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(100),

    content: vine.string().maxLength(3000).optional(),

    images: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })
      )
      .maxLength(25)
      .optional(),
  })
)

export const updateEventsValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(100),

    content: vine.string().maxLength(3000).optional(),

    images: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })
      )
      .maxLength(25)
      .optional(),

    removeImages: vine.array(vine.string()).optional(),
  })
)
