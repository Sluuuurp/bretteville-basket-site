class CacheScrapService {
  private cache: Record<string, any>
  private timestamps: Record<string, number>
  private expire: number

  constructor() {
    this.cache = {}
    this.timestamps = {}
    // 6 * 60 min * 60 sec * 1000 ms
    this.expire = 6 * 60 * 60 * 1000 
  }

  //fetchfn -> la fonction de scrapping a passé en param 
  async get(cacheName, fetchFn) {
    const now = Date.now()

    //check si donnee deja en cache && le timespant existe && si le timestanp pas expiré
    if (this.cache[cacheName] && this.timestamps[cacheName] && now - this.timestamps[cacheName] < this.expire) {
      return this.cache[cacheName]
    }

    console.log(`SCRAP EXECUTÉ pour ${cacheName}`)

    const data = await fetchFn()

    this.cache[cacheName] = data
    this.timestamps[cacheName] = now

    return data
  }
}

export default new CacheScrapService()
