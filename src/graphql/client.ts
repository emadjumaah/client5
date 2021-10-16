import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { isElectron } from '../common';

const stringstore = localStorage.getItem('store');
const store = stringstore ? JSON.parse(stringstore) : null;

const token = store ? store.token : null;

const uri = isElectron
  ? 'https://jadwal-web.herokuapp.com/'
  : process?.env?.GRAPHQL_URI
  ? process.env.GRAPHQL_URI
  : 'http://jadwal-main:4000/graphql';

const httpLink = createHttpLink({
  uri,
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
