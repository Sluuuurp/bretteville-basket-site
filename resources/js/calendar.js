//************************* Liste Equipe et Calendrier *************************/
export function initCalendar() {
  const container = document.getElementById('teams-container')

  container.addEventListener('click', async (e) => {
    const item = e.target.closest('.team-item')
    if (!item) return

    const calendarDiv = item.nextElementSibling
    const matchesDiv = calendarDiv.querySelector('.matches')
    const loadingDiv = calendarDiv.querySelector('.loading')
    const gender = container.dataset.gender
    const rankBtn = calendarDiv.querySelector('.classement-btn')

    const colorGender = gender === 'F' ? 'bg-[rgba(218,15,131,0.2)]' : 'bg-[rgba(0,101,160,0.2)]'

    calendarDiv.classList.toggle('hidden')

    if (calendarDiv.dataset.loaded) return

    loadingDiv.style.display = 'block'

    try {
      const codeteam = encodeURIComponent(item.dataset.link.split('/').pop())
      const res = await fetch(`/calendrier?codeteam=${codeteam}`)
      const teamCal = await res.json()
      const matches = teamCal.calendar

      matchesDiv.innerHTML = matches
        .map((match, index) => {
          //double ternaire ici, un peu lourd mais tailwind ne semble pas fomctionne avec md: + variable dynamique bref l index pour le 1/2 et le gender pour la couleur
          const bgclass =
            index % 2 === 0
              ? gender === 'F'
                ? 'md:bg-[rgba(218,15,131,0.2)]'
                : 'md:bg-[rgba(0,101,160,0.2)]'
              : 'md:bg-white'
          return `
      <div class="match mt-5 md:mt-10 p-4 flex items-center ${bgclass} font-manrope max-w-375">
        <div class="grid grid-cols-6 font-bold items-center relative">
         
          <p class=' w-50 col-start-1 text-sm'><span class='uppercase mr-5 md:mr-0.5 xl:mr-5'>${match.journee}</span> | <span class='opacity-65 ml-5 md:ml-0.5 xl:ml-5'>${match.date}</span></p>
          <p class='uppercase text-sm  md:text-center opacity-50 col-start-6 md:col-start-2 xl:col-start-2 '>${match.lieu}</p>
          <div class='h-5 w-full ${colorGender} absolute top-0 md:hidden'></div>
          <div class='flex h-10 md:h-15 text-center col-start-1 col-span-6 md: md:col-start-3 mt-2'>
            <p class='uppercase w-30 text-xs m-auto'>Bretteville Basket Cingal</p>
            <img class='' src='/public/img/logo-bbc.png'>
            <div class='flex items-center h-15 md:h-20 gap-3 md:gap-6 font-teko text-4xl'>
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
        })
        .join('')

      calendarDiv.dataset.loaded = 'true'
    } catch (err) {
      matchesDiv.textContent = 'Erreur lors du chargement'
      console.error(err)
    } finally {
      loadingDiv.style.display = 'none'
      rankBtn.style.display = 'block'
    }
  })
}
