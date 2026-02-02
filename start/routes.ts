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

router.get('/equipes', '#controllers/team_data/teams_list_controller.show')

router.get('/calendrier', '#controllers/team_data/team_calendar_controller.show')

router.get('/classement', '#controllers/team_data/team_ranking_controller.show')

//crud evenements
router.get('/evenements/creation', '#controllers/events_news/events_controller.create')
router.post('/events/store', '#controllers/events_news/events_controller.store')
router.get('/evenements', '#controllers/events_news/events_controller.index')
router.get('/evenements/:id', '#controllers/events_news/events_controller.show')
router.get('/evenements/:id/edit', '#controllers/events_news/events_controller.edit')
router.patch('/evenements/:id', '#controllers/events_news/events_controller.update')
