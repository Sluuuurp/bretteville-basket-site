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
router.delete('/evenements/:id', '#controllers/events_news/events_controller.destroy')

//crud article
router.get('/articles/creation', '#controllers/shop/articles_controller.create')
router.post('/articles/store', '#controllers/shop/articles_controller.store')
router.get('/articles', '#controllers/shop/articles_controller.index')
router.get('/articles/:id/edit', '#controllers/shop/articles_controller.edit')
router.patch('/articles/:id', '#controllers/shop/articles_controller.update')
router.delete('/articles/:id', '#controllers/shop/articles_controller.destroy')

//route reservations
router.get('/reservations/creation', '#controllers/reservations/reservations_controller.create')
router.post('/reservations/store', '#controllers/reservations/reservations_controller.store')
