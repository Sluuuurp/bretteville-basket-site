import { initCart } from './cart.js'
import { initCalendar } from './calendar.js'

if (document.getElementById('cart')) {
  initCart()
}

if (document.getElementById('teams-container')) {
  initCalendar()
}
