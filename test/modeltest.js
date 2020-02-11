const {assert} = require('chai')
const model = require('../src/mongomodelmanual')

describe('simple crud operations', function () {

  beforeEach(async () => {
    const usersbeforedelete = await model.getUser({})
    await deleteAll()
    const users = await model.getUser({})
    assert.lengthOf(users, 0)
  })

  it('can read a resource', async function () {
    await deleteAll()
    await createUser('Imogen Spurnrose', 'Banker Street', 'The Burgue')
    await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')

    const read = await model.getUser({})

    assert.lengthOf(read, 2)
  })
  it('can create a resource', async function () {
    const stored = await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')
    const read = await model.getUser({_id: stored._id})

    assert.lengthOf(read, 1)
    assert.deepEqual(stored, read[0])
  })
  it('can update a resource', async function () {
    const stored = await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')
    stored.name = 'Imogen Spurnrose'
    await model.updateUser(stored)

    const read = await model.getUser({_id: stored._id})

    assert.deepEqual(stored, read[0])
  })
  it('can remove a resource', async function () {
    const stored = await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')

    await model.removeUser(stored)

    const read = await model.getUser({_id: stored._id})
    assert.lengthOf(read, 0)
  })


  it('can read deep models', async function () {
    const us = await model.getUser({})
    const imogen = await createUser('Imogen Spurnrose', 'Banker Street', 'The Burgue')
    const philo = await createUser('Rycroft Philostrate', 'Carnival Row', 'The Burgue')

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
      //console.dir(mv, {depth: null})
    }
  })
})

async function deleteAll() {
  try {
    const users = await model.getUser({})
    if (users) {
      for (user of users) {
        await model.removeUser(user)
      }
    }
    const movies = await model.getMovie({})
    if (movies) {
      for (movie of movies) {
        await model.removeMovie(movie)
      }
    }
  } catch (e) {
    console.log(e)
  }
}


async function createUser(name, street, city) {
  const user = await model.getUser({name})
  if (!user || user.length < 1) {
    const result = await model.createUser({name, address: {street, city}})
    return result
  } else {
    return user[0]
  }
}

async function createMovie(title) {
  const movie = await model.getMovie({title})
  if (!movie || movie.length < 1) {
    return await model.createMovie({title})
  }
  return movie[0]
}
