const { Schema, model, models }= require('mongoose')

const authorSchema = new Schema({
  name: String,
  books: [{ type: Schema.Types.ObjectId, ref: 'book' }]
})
const bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'author' }
})

module.exports = {
  Author: models['author'] ? model('author') : model('author', authorSchema),
  Book: models['book'] ? model('book') : model('book', bookSchema),
}
