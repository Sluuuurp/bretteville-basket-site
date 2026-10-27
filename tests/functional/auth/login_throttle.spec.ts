import { test } from '@japa/runner'

// envoie une tentative de connexion avec un mauvais mot de passe
function wrongLogin(client: any, email: string) {
  return client
    .post('/login')
    .header('referer', '/login')
    .form({ email, password: 'mauvais-mot-de-passe' })
    .withCsrfToken()
    .redirects(0)
}

test.group('Login | protection brute force', () => {
  test('les 5 premiers echecs renvoient "identifiants invalides"', async ({ client }) => {
    for (let i = 1; i <= 5; i++) {
      const response = await wrongLogin(client, 'cinq@test.fr')

      response.assertStatus(302)
      response.assertFlashMessage('errorsBag', { E_INVALID_CREDENTIALS: 'Invalid user credentials' })
    }
  })

  test('la 6e tentative dans la minute est bloquee', async ({ client, assert }) => {
    for (let i = 1; i <= 5; i++) {
      await wrongLogin(client, 'bloque@test.fr')
    }

    const response = await wrongLogin(client, 'bloque@test.fr')

    response.assertStatus(302)
    const errors = response.flashMessages().errorsBag
    assert.match(errors.E_TOO_MANY_REQUESTS, /^Trop de tentatives/)
    assert.notProperty(errors, 'E_INVALID_CREDENTIALS')
  })

  test('un autre email depuis la meme ip n est pas bloque', async ({ client }) => {
    for (let i = 1; i <= 6; i++) {
      await wrongLogin(client, 'victime@test.fr')
    }

    const response = await wrongLogin(client, 'innocent@test.fr')

    response.assertFlashMessage('errorsBag', { E_INVALID_CREDENTIALS: 'Invalid user credentials' })
  })
})
