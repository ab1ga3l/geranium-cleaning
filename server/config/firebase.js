const admin = require('firebase-admin')

let db = null

function getDb() {
  if (db) return db

  if (!admin.apps.length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : null

    if (!serviceAccount) {
      console.warn('[Firebase] No service account found. Using mock DB for development.')
      return null
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
  }

  db = admin.firestore()
  return db
}

// In-memory fallback for development without Firebase
const mockDb = {
  _store: {},
  collection(name) {
    if (!this._store[name]) this._store[name] = {}
    const store = this._store[name]
    return {
      doc(id) {
        const docId = id || `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`
        return {
          id: docId,
          async get() {
            return { exists: !!store[docId], data: () => store[docId], id: docId }
          },
          async set(data) { store[docId] = { ...data, id: docId }; return { id: docId } },
          async update(data) { store[docId] = { ...store[docId], ...data } },
        }
      },
      async add(data) {
        const id = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`
        store[id] = { ...data, id }
        return { id }
      },
      async get() {
        return {
          docs: Object.values(store).map(d => ({
            id: d.id, data: () => d, exists: true,
          })),
          empty: Object.keys(store).length === 0,
        }
      },
      where(field, op, value) {
        return {
          async get() {
            const results = Object.values(store).filter(d => {
              if (op === '==') return d[field] === value
              if (op === '>=') return d[field] >= value
              if (op === '<=') return d[field] <= value
              return true
            })
            return {
              docs: results.map(d => ({ id: d.id, data: () => d, exists: true })),
              empty: results.length === 0,
            }
          },
          orderBy() { return this },
          limit() { return this },
        }
      },
      orderBy() { return this },
      limit() { return this },
    }
  },
}

module.exports = {
  getDb: () => getDb() || mockDb,
  admin,
}
