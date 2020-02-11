const {assert} = require('chai')
const { server, db } = require('../src/graphql')
const { ApolloServer, gql } = require('apollo-server-express')
const { createTestClient } = require('apollo-server-testing')
const { query, mutate } = createTestClient(server);
const createSampleData = require('../src/sampledata')

describe('simple crud operations', function () {
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
    console.log(result.data)
  })
})

after(function (done) {
    db.db.dropDatabase(function () {
        db.close(function () {
            done();
        });
    });
});

before(async function () {
  await createSampleData() 
})
