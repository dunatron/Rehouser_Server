const {
  GraphQLServer,
  PubSub,
  SchemaDirectiveVisitor
} = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Connection = require("./resolvers/Connection");
const Subscription = require("./resolvers/Subscription");
const db = require("./db");
// https://www.robinwieruch.de/graphql-apollo-server-tutorial

const {
  DateTimeResolver,
  URLResolver,
  JSONResolver
} = require("graphql-scalars");

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,
  Json: JSONResolver,
  Query: {
    ...Query,
    ...Connection
  },
  Mutation,
  Subscription
};

// create the graphql yoga server
function createServer() {
  return new GraphQLServer({
    typeDefs: "src/schema.graphql",
    resolvers: resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => ({ ...req, db }) // probs just put this back
  });
}

module.exports = createServer;
