const { ApolloServer, gql } = require("apollo-server");
import { products, categories, reviews } from './data.js';

// String, Int, Float, Boolean

const typeDefs = gql`
    type Query {
        hello: String
        products: [Product!]!
    }

    type Product {
        name: String!
        description: String!
        quantity: Int!
        price: Float!
        onSale: Boolean!
    }
`

const resolvers = {
    Query: {
        hello: () => {
            hello: String
        },

        products: () => {
            return products
        }
    }
}

const server = new ApolloServer({
    typeDefs, 
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server is ready at ${ url }`);
})

