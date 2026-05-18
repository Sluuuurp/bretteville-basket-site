/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const TeamsListController = () => import('#controllers/team_data/teams_list_controller')
const CalendarsController = () => import('#controllers/team_data/team_calendar_controller')
const TeamRankingController = () => import('#controllers/team_data/team_ranking_controller')
const EventsController = () => import('#controllers/events_news/events_controller')
const ArticlesController = () => import('#controllers/shop/articles_controller')
const ReservationsController = () => import('#controllers/reservations/reservations_controller')
const SponsorsController = () => import('#controllers/sponsors/sponsors_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const RefereesTableController = () => import('#controllers/referee_table/referees_table_controller')
const HomeController = () => import('#controllers/home_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const TournamentRegistrationController = () =>
  import('#controllers/tournament_registrations_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import mail from '@adonisjs/mail/services/main'

//dashboard admin

//home
router.get('/', [HomeController, 'index'])

// pour la creation de compte
// router.get('/register', [RegisterController, 'show']).as('register.show')
// router.post('/register', [RegisterController, 'store']).as('register.store')

router.get('/login', [LoginController, 'show']).as('login.show')
router.post('/login', [LoginController, 'store']).as('login.store')

//liste des equipes et calendrier
router.get('/equipes', [TeamsListController, 'show'])
router.get('/calendrier', [CalendarsController, 'show'])

//route securisee
router
  .group(() => {
    //crud sponsor
    router.get('/sponsors/creation', [SponsorsController, 'create'])
    router.post('/sponsors/store', [SponsorsController, 'store'])
    router.get('/sponsors/:id/edit', [SponsorsController, 'edit'])
    router.patch('/sponsors/:id', [SponsorsController, 'update'])
    router.delete('/sponsors/:id', [SponsorsController, 'destroy'])

    // table arbitrage
    router.get('/arbitrage/edit', [RefereesTableController, 'edit'])
    router.post('/arbitrage', [RefereesTableController, 'update'])

    //articles
    router.get('/articles/creation', [ArticlesController, 'create'])
    router.post('/articles/store', [ArticlesController, 'store'])
    router.get('/articles/:id/edit', [ArticlesController, 'edit'])
    router.patch('/articles/:id', [ArticlesController, 'update'])
    router.delete('/articles/:id', [ArticlesController, 'destroy'])

    //evenements
    router.get('/evenements/creation', [EventsController, 'create'])
    router.post('/events/store', [EventsController, 'store'])
    router.get('/evenements/:id/edit', [EventsController, 'edit'])
    router.patch('/evenements/:id', [EventsController, 'update'])
    router.delete('/evenements/:id', [EventsController, 'destroy'])

    //delete une reservation
    router.delete('/reservations//id', [ReservationsController, 'destroy'])

    //dl csv tournoi
    router.get('/administration/tournoicsv', [TournamentRegistrationController, 'exportCsv'])

    //
    router.post('/logout', [LogoutController, 'handle']).as('logout')
    router.get('/administration', [DashboardController, 'show'])
  })
  .use(middleware.auth())

//classement equipe
router.get('/classement/:codeteam', [TeamRankingController, 'show'])
router.get('/classement', async ({ response }) => {
  return response.redirect('/equipes')
})

//crud evenements
router.get('/evenements', [EventsController, 'index'])
router.get('/evenements/:id', [EventsController, 'show'])

//crud article
router.get('/articles', [ArticlesController, 'index'])

//crud sponsor
router.get('/sponsors', [SponsorsController, 'index'])

//route reservations
router.get('/reservations/creation', [ReservationsController, 'create'])
router.post('/reservations/store', [ReservationsController, 'store'])

//table d arbitrage
router.get('/arbitrage', [RefereesTableController, 'show'])

//mentions legales
router.on('/mentions-legales').render('pages/legal/mentions_legales')

//inscription tournoi
router.get('/inscription-tournoi', [TournamentRegistrationController, 'create'])
router.post('/inscription-tournoi/store', [TournamentRegistrationController, 'store'])