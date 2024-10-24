// src/ApolloProvider.js
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Update to your GraphQL server URI
  cache: new InMemoryCache(),
});

const MyApolloProvider = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);

export default MyApolloProvider;
