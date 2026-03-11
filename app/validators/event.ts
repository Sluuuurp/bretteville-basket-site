import vine from '@vinejs/vine'

export const storeEventsValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(250),

    content: vine.string().maxLength(3000).optional(),

    images: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })
      )
      .optional(),
  })
)

export const updateEventsValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(250),

    content: vine.string().maxLength(3000).optional(),

    images: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['jpg', 'jpeg', 'png', 'webp'],
        })
      )
      .optional(),

    removeImages: vine.array(vine.string()).optional(),
  })
)
