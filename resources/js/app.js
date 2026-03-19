import { initCart } from './cart.js'
import { initCalendar } from './calendar.js'

if (document.getElementById('cart')) {
  initCart()
}

if (document.getElementById('teams-container')) {
  initCalendar()
}

// Preview image
document.addEventListener('DOMContentLoaded', () => {
  const imageInput = document.getElementById('image-input')
  const previewContainer = document.getElementById('image-preview')

  if (imageInput && previewContainer) {
    imageInput.addEventListener('change', (e) => {
      previewContainer.innerHTML = '' // Reset

      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const img = document.createElement('img')
          img.src = event.target.result
          img.className = 'w-48 h-48 object-cover rounded border-2 border-gray-300'
          previewContainer.appendChild(img)
        }
        reader.readAsDataURL(file)
      }
    })
  }
})
