class CacheScrapService {
  private cache: Record<string, any>
  private timestamps: Record<string, number>
  private expire: number

  constructor() {
    this.cache = {}
    this.timestamps = {}
    this.expire = 6 * 60 * 60 * 1000 // 6h
  }

  async get(key, fetchFn) {
    const now = Date.now()

    if (this.cache[key] && this.timestamps[key] && now - this.timestamps[key] < this.expire) {
      return this.cache[key]
    }

    console.log(`SCRAP EXECUTÉ pour ${key}`)

    const data = await fetchFn()

    this.cache[key] = data
    this.timestamps[key] = now

    return data
  }
}

export default new CacheScrapService()
