const { expect } = require('chai')
const { server, db } = require('../src/graphql')
const matchers = require('chadomatcher')
const { ApolloServer, gql } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const createSampleData = require('../src/sampledata')

describe('simple crud operations', function () {
  after(function (done) {
      db.db.dropDatabase(function () {
          db.close(function () {
              done();
          });
      });
  });
  before(async () => {
    console.log('create sample data')
    await createSampleData() 
  })
  it('can query authors', async function () {
    const result = await query({
      query: gql`
        query {
          books { 
            title 
          }
        }
      `
    });
    
    expect(matchers.array.containing('The Philosopher\'s Stone', 'Harry Potter and the Chamber of Secrets', 'Jurassic Park').matches(result.data.books.map(e => e.title))).to.be.true
  })
})

