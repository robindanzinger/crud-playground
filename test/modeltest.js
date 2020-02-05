const {assert} = require('chai')
const model = require('../src/model')

const {MongoClient} = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url, {useNewUrlParser: true})

function connect() {
  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err)
      } else {
        resolve({cl:client})
      }
    })
  })
}

describe('write and read', function () {

  it('foo', function () {

var arrays = [
  ["$6"],
  ["$12"],
  ["$25"],
  ["$25"],
  ["$18"],
  ["$22"],
  ["$10"]
];
var merged = [].concat.apply([], arrays)
console.log([].concat.apply([], [[1,2],3]))
 console.log([1].concat([2,3],[4],5))
console.log(merged)
  }),
  it('will always pass', async function () {
    
    const us = await model.getUser({})
    console.log('START TEST: all users in db', us)

    const philo = await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')
    const imogen = await createUser('Imogen Spurnrose', 'Banker Street', 'The Burgue')

    const carnivalRow = await createMovie('Carnival Row')
    const starWars = await createMovie('Star Wars')

    carnivalRow.rating = []
    carnivalRow.rating.push({user: philo._id, rate: "5"})
    carnivalRow.rating.push({user: imogen._id, rate: "4"})

    starWars.rating = []
    starWars.rating.push({user: philo._id, rate: "1"})
    starWars.rating.push({user: imogen._id, rate: "1"})

    await model.updateMovie(starWars)
    await model.updateMovie(carnivalRow)

    const mvs = await model.getMovieDeep({})
    for (const mv of mvs) {
      console.dir(mv, {depth: null})
    }

    // await deleteAll();
  })
})

async function deleteAll() {
  try {
    const users = await model.getUser({})
    if (users)
      users.forEach(async u => {
        await model.removeUser(u)
        console.log("deleted user", u)
      })
    const movies = await model.getMovie({})
    if (movies)
      movies.forEach(m => {
        model.removeMovie(m)
      })
  } catch (e) {
    console.log('SOMETHING WENT WRONG')
    console.err(e)
  }
}


async function createUser(name, street, city) {
  const user = await model.getUser({name})
  console.log('found user with name', name, user !== null)
  if (!user || user.length < 1) {
    console.log('create new user')
    return await model.createUser({name, address: {street, city}})
  } else {
    return user[0]
  }
}

async function createMovie(title) {
  const movie = await model.getMovie({title})
  console.log('found movie with title', title, movie !== null)
  if (!movie || movie.length < 1) {
    return await model.createMovie({title})
  }
  return movie[0]
}
