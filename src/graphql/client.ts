import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { graphqlURI } from '../constants';

const stringstore = localStorage.getItem('store');
const store = stringstore ? JSON.parse(stringstore) : null;

const token = store ? store.token : null;

const httpLink = createHttpLink({
  uri: graphqlURI,
  // uri: 'http://jadwal-server:4000/graphql',
  // uri: 'http://jadwal-main:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Jadwal ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
