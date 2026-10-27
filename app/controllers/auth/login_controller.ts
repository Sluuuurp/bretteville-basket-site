import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import limiter from '@adonisjs/limiter/services/main'

// protection brute force : 5 tentatives echouees max par minute
const loginLimiter = limiter.use({
  requests: 5,
  duration: '1 minute',
})

export default class LoginController {
  async show({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async store({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // cle ip + email : on ne bloque ni toute une box, ni le compte pour tout le monde
    const key = `login_${request.ip()}_${email}`

    // penalize compte uniquement les echecs, et remet le compteur a zero en cas de succes
    const [error, user] = await loginLimiter.penalize(key, () => {
      return User.verifyCredentials(email, password)
    })

    if (error) {
      session.flashExcept(['password'])
      session.flashErrors({
        E_TOO_MANY_REQUESTS: `Trop de tentatives, réessayez dans ${error.response.availableIn} secondes`,
      })
      return response.redirect().back()
    }

    await auth.use('web').login(user)

    return response.redirect().toPath('/administration')
  }
}
