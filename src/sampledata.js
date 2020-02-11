const { Book, Author } = require('./model')
async function createSampleData() {
  await Author.deleteMany()
  await Book.deleteMany()

  // authors
  const rowling = new Author({
    name: 'J.K. Rowling'
  })
  const rid = await rowling.save()
  const crichton = new Author({
    name: 'Michael Crichton'
  })
  const cid = await crichton.save()

  // books
  const hp1 = new Book( {
    title: 'The Philosopher\'s Stone',
    author: rid._id,
  })

  const hp2 = new Book({
    title: 'Harry Potter and the Chamber of Secrets',
    author: rid._id,
  })

  const jp = new Book({
    title: 'Jurassic Park',
    author: cid._id,
  })

  hp1.save()
  hp2.save()
  jp.save()
}

module.exports = createSampleData
