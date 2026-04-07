export function modal() {
  const openBtn = document.getElementById('open-modal')
  const modal = document.getElementById('modal')
  const closeBtn = document.getElementById('close-modal')

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden')
    modal.classList.add('flex')
  })

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
  })

  // fermer en cliquant en dehors
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden')
      modal.classList.remove('flex')
    }
  })
}
