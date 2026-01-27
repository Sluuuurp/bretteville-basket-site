/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/equipes', '#controllers/teams_list_controller.show')

router.get('/calendrier', '#controllers/team_calendar_controller.show')

router.get('/classement', '#controllers/team_ranking_controller.show')
