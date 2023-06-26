import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { createHttpLink, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

import Auth from './utils/auth';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </ApolloProvider>
    </Router>
  );
}

export default App;
