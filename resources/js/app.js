console.log('Hello World')

//gestion du depliment du calendrier de la liste des equipes
document.querySelectorAll('.team-item').forEach((item) => {
  item.addEventListener('click', async () => {
    const calendarDiv = item.querySelector('.calendar')
    const matchesDiv = calendarDiv.querySelector('.matches')
    const loadingDiv = calendarDiv.querySelector('.loading')

    calendarDiv.classList.toggle('hidden')

    if (calendarDiv.dataset.loaded) return

    loadingDiv.style.display = 'block'

    try {
      const codeteam = encodeURIComponent(item.dataset.link.split('/').pop())
      const res = await fetch(`/calendrier?codeteam=${codeteam}`)
      const teamCal = await res.json() // ceci est { calendar: [...] }
      const matches = teamCal.calendar // tableau de matchs

      matchesDiv.innerHTML = teamCal.calendar
        .map(
          (match) => `
    <div class="match border rounded p-4 flex gap-4 items-center bg-white shadow">
      <div class="flex flex-col">
        <p class="font-bold">Numéro: ${match.numero}</p>
        <p>Journée: ${match.journee}</p>
        <p>Date: ${match.date}</p>
        <p>Équipe: ${match.equipe}</p>
        <p>Score: ${match.scoreBBC} - ${match.scoreExt}</p>
      </div>
    </div>
  `
        )
        .join('')

      calendarDiv.dataset.loaded = 'true'
    } catch (err) {
      matchesDiv.textContent = 'Erreur lors du chargement'
      console.error(err)
    } finally {
      loadingDiv.style.display = 'none'
    }
  })
})
