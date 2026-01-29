import vine from '@vinejs/vine'

export const storeEventsValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(250),

    content: vine.string().optional(),

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
