const MongoClient = require('mongodb').MongoClient

function connect() {
  return new Promise((resolve, reject) => {
    const url = 'mongodb://localhost:27017'
    MongoClient.connect(url, (err, client) => {
      if (err) {
        reject(err)
      }
      const db = client.db('moviedb')
      const collection = db.collection('Movie')
      resolve({collection, client})
    })
  })
}

function insert(movie) {
  movie.id = Date.now()
  return connect().then(({collection, client}) => {
    return new Promise((resolve, reject) => {
      collection.insertOne(movie, {safe: true}, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
        client.close()
      })
    })
  })
}

function get(query = {}) {
  return connect().then(({ collection, client }) => {
    return new Promise((resolve, reject) => {
      collection.find(query).toArray((error, docs) => {
        if (error) {
          reject(error)
        } else {
          resolve(docs)
        }
        client.close()
      })
    })
  })
}

function getAll()  {
  return connect().then(({ collection, client }) => {
    return new Promise((resolve, reject) => {
      collection.find({}).toArray((error, docs) => {
        if (error) {
          reject(error)
        } else {
          resolve(docs)
        }
        client.close()
      })
    })
  })
}

function update(movie) {
  movie.id = parseInt(movie.id, 10)
  return connect().then(({ collection, client }) => {
    return new Promise((resolve, reject) => {
      collection.update(
        { id: movie.id },
        { $set: movie },
        { safe: true},
        function(error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
          client.close()
        })
    })
  })
}

function remove(id) {
  return connect().then(({collection, client}) => {
    return new Promise((resolve, reject) => {
      collection.remove({id}, {safe: true}, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
        client.close()
      })
    })
  })
}


module.exports = {
  getAll,
  get(id) {
    return get({ id }).then(movie => movie[0])
  },
  delete(id) {
    return remove(id)
  },
  save(movie) {
    if (!movie.id) {
      const nm = insert(movie)
      console.log(nm)
      return nm
    }
    return update(movie)
  }
}


