const container = document.getElementById('teams-container')

container.addEventListener('click', async (e) => {
  const item = e.target.closest('.team-item')
  if (!item) return

  const calendarDiv = item.querySelector('.calendar')
  const matchesDiv = calendarDiv.querySelector('.matches')
  const loadingDiv = calendarDiv.querySelector('.loading')

  calendarDiv.classList.toggle('hidden')

  if (calendarDiv.dataset.loaded) return

  loadingDiv.style.display = 'block'

  try {
    const codeteam = encodeURIComponent(item.dataset.link.split('/').pop())
    const res = await fetch(`/calendrier?codeteam=${codeteam}`)
    const teamCal = await res.json()
    const matches = teamCal.calendar

    matchesDiv.innerHTML = matches
      .map(
        (match) => `
      <div class="match border rounded p-4 flex items-center bg-white shadow font-manrope">
        <div class="grid grid-cols-6 font-bold items-center bg-amber-400">
         
          <p class='md:bg-blue-500 w-50 col-start-1 text-sm'><span class='uppercase mr-5 md:mr-0.5'>${match.journee}</span> | <span class='opacity-65 ml-5 md:ml-0.5'>${match.date}</span></p>
          <p class='uppercase text-sm  md:text-center opacity-50 col-start-6 md:col-start-2 xl:col-start-2 bg-green-400'>${match.lieu}</p>
          <div class='flex h-15 text-center bg-red-500 col-start-1 col-span-6 md: md:col-start-3 xl:col-start-4 xl:col-span-2 mt-2'>
            <p class='uppercase w-30 text-xs m-auto'>Bretteville Basket Cingal</p>
            <img class='' src='/public/img/logo-bbc.png'>
            <div class='flex items-center h-20 gap-6 font-teko text-4xl'>
              <span> ${match.scoreBBC || '0'}</span>
              <img class='' src='/public/img/versus.png'>
              <span>${match.scoreExt}</span>
            </div>
            <img class='ml-10' src=${match.img && !match.img.includes('defaultLogo') ? match.img : '/public/img/logo-ffbb.jpg'} />
            <p class='uppercase w-30 text-xs  m-auto'>${match.equipe}</p>
          </div>
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
