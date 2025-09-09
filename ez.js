class ezstorage {
  constructor() {
    this.localstore = (typeof window !== "undefined") ? window.localStorage : null
    this.prefix = "ez"
    this.events = {}
  }

  fullkey(key) {
    return this.prefix + key
  }

  triggerevent(event, key, value) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(key, value))
    }
  }

  set(key, value) {
    if (!this.localstore) return false
    try {
      const fk = this.fullkey(key)
      this.localstore.setItem(fk, JSON.stringify(value))
      this.triggerevent("onset", key, value)
      return true
    } catch { return false }
  }

  get(key, fallback = null) {
    if (!this.localstore) return fallback
    try {
      const fk = this.fullkey(key)
      const raw = this.localstore.getItem(fk)
      return raw !== null ? JSON.parse(raw) : fallback
    } catch { return fallback }
  }

  remove(key) {
    if (!this.localstore) return false
    try {
      const fk = this.fullkey(key)
      this.localstore.removeItem(fk)
      this.triggerevent("onremove", key, null)
      return true
    } catch { return false }
  }

  clear() {
    if (!this.localstore) return false
    try {
      Object.keys(this.localstore)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => this.localstore.removeItem(k))
      this.triggerevent("onclear", null, null)
      return true
    } catch { return false }
  }

  setmany(obj) {
    Object.entries(obj).forEach(([k, v]) => this.set(k, v))
  }

  getmany(keys) {
    return keys.map(k => this.get(k))
  }

  haskey(key) {
    return this.localstore && this.localstore.getItem(this.fullkey(key)) !== null
  }

  keys() {
    return Object.keys(this.localstore)
      .filter(k => k.startsWith(this.prefix))
      .map(k => k.slice(this.prefix.length))
  }

  size() {
    return this.keys().length
  }

  getstring(key, fallback = "") {
    const val = this.get(key, fallback)
    return typeof val === "string" ? val : fallback
  }

  getnumber(key, fallback = 0) {
    const val = this.get(key, fallback)
    return typeof val === "number" ? val : fallback
  }

  getboolean(key, fallback = false) {
    const val = this.get(key, fallback)
    return typeof val === "boolean" ? val : fallback
  }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(fn)
  }
}

export default new ezstorage()
