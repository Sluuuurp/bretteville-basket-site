import { initCart } from './cart.js'
import { initCalendar } from './calendar.js'
import { formImg } from './form-img.js'

if (document.getElementById('cart')) {
  initCart()
}

if (document.getElementById('teams-container')) {
  initCalendar()
}

if (document.querySelector('form')) {
  formImg()
}
