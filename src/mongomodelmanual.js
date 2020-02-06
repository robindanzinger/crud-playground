const MongoClient = require('mongodb').MongoClient
const dbname = 'testdb'
const url = 'mongodb://localhost:27017/'

function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log('Error on connecting with db server')
        reject(err)
      }
      resolve(client)
    })
  })
}

async function onCollection(name, collectionName, opFunc, resolveFunc = (r) => r) {
  let client
  try {
    client = await connect()
    const db = client.db(dbname)
    const collection = db.collection(collectionName)
    const result = await opFunc(collection)
    const resolved = resolveFunc(result)
    return resolved
  } catch (e) {
    console.log(e)
  } finally {
    if (client) {
      client.close()
    }
  }
}

function create(collection, item) {
  return onCollection('create', collection, (col) => {
    return col.insertOne(item, {safe: true})
  }, (result) => {return result.ops[0]})
}

async function get(collection, query) {
  return onCollection('get', collection, (col) => {
    return col.find(query).toArray()
  })
}

async function getResolveEmbedded(collection, aggregates, query) {
  const result = await onCollection('get', collection, (col) => {
    return col.find(query).toArray()
  })
  return resolveAggregates(result, aggregates)
}

async function resolveAggregates(items, aggregates) {
  for (aggregate of aggregates) {
    await resolveAggregate(items, aggregate)
  }
  return items
}

async function resolveAggregate(items, aggregate) {
  for (item of items) {
    const key = Object.keys(aggregate)[0]
    const sourcePath = key.split('.')
    const targetPath = aggregate[key].split('.')
    const prop = sourcePath.pop()

    const objects = sourcePath.reduce((acc,cur) => {
      return [].concat.apply([], acc.map(e => {
        if (e[cur] instanceof Array) {
          return e[cur].reduce((acc, val) => acc.concat(val), [])
        }
        return e[cur]
      }))
    }, [item])

    for (const obj of objects) {
      const realob = await get(targetPath[0], {_id: obj[prop]})
      obj[prop] = realob[0]    
    }
  }
  return items
}

function getAll(collection) {
  return onCollection('getAll', collection, (col) => {
    return col.find({}).toArray()})
}

function update(collection, item) {
  return onCollection('update', collection, (col) => {
    return col.updateOne(
      {_id: item['_id']},
      {$set: item },
      {safe: true}
    )
  }, (result) => {return result})
}

function remove(collection, item) {
  return onCollection('remove', collection, (col) => {
    return col.remove({'_id': item['_id']}, {safe: true})
  })
}

function insertUser(user) {
  return create('user', user)
}

module.exports = {
  createMovie: create.bind(null, 'movie'),
  getMovie: get.bind(null, 'movie'),
  getMovieDeep: getResolveEmbedded.bind(null, 'movie', [{'rating.user': 'user._id'}]),
  removeMovie: remove.bind(null, 'movie'),
  updateMovie: update.bind(null, 'movie'),

  createUser: create.bind(null, 'user'),
  getUser: get.bind(null, 'user'),
  removeUser: remove.bind(null, 'user'),
  updateUser: update.bind(null, 'user')
}
