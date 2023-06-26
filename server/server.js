const express = require('express');
const cors = require('cors');

const path = require('path');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');
const { graphQLAuthMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server, { context: graphQLAuthMiddleware }));  

  // serve up react front-end in prod
  app.use((_, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
  
  db.once('open', async () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  });
});
