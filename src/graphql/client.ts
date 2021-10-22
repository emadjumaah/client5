import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { isElectron } from '../common';

const stringstore = localStorage.getItem('store');
const store = stringstore ? JSON.parse(stringstore) : null;

const token = store ? store.token : null;

const uri = isElectron
  ? 'https://jadwal-web.herokuapp.com/graphql'
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const isRTL = store?.lang === 'ar';
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message === 'auth token error') {
        const newStore = {
          ...store,
          user: null,
          token: null,
        };
        localStorage.setItem('store', JSON.stringify(newStore));
        window.location.reload();
      }
      if (message === 'package time limit exceeded') {
        const newStore = {
          ...store,
          packIssue: true,
          packIssueMsg: isRTL
            ? 'لقد انتهى وقت الإشتراك الخاص بك ، يرجى تجديد الإشتراك'
            : 'your subscription suspended!, please renew',
        };
        localStorage.setItem('store', JSON.stringify(newStore));
      }
      if (message === 'package docs limit exceeded') {
        const newStore = {
          ...store,
          packIssue: true,
          packIssueMsg: isRTL
            ? 'عدد الوثائق المسموحة لهذا الاشتراك قد نفذت ، يرجى رفع الإشتراك أو التواصل معنا'
            : 'you reach documents limit of your subscription, please upgrade or contact us',
        };
        localStorage.setItem('store', JSON.stringify(newStore));
      }
      if (message === 'package users limit exceeded') {
        const newStore = {
          ...store,
          packIssue: true,
          packIssueMsg: isRTL
            ? 'عدد المستخدمين المسموحة بهم لهذا الاشتراك قد نفذت ، يرجى رفع الإشتراك أو التواصل معنا'
            : 'you reach users limit of your subscription, please upgrade or contact us',
        };
        localStorage.setItem('store', JSON.stringify(newStore));
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
});
