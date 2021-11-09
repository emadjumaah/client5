/* eslint-disable import/first */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useReducer } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/client';
import { createThem } from './themes';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
// import { isElectron } from './common';
import { getStoreItem, setStoreItem } from './store';
import { Layout } from './pages/main';
import { initStore, storeReducer } from './store';
import { GlobalContext } from './contexts';
import { useTranslate } from './hooks';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  // Store and Theme
  const storeState = getStoreItem('store', initStore);
  const [store, dispatch] = useReducer(
    storeReducer,
    storeState ? storeState : initStore
  );
  const theme = createThem({ lang: store.lang, themeId: store.themeId });
  const translate = useTranslate(store.lang);
  useEffect(() => {
    setStoreItem('store', store);
  }, [store]);

  // Apollo Client
  const token = store ? store.token : null;

  // const uri = isElectron
  //   ? 'https://jadwal-web.herokuapp.com/graphql'
  //   : process?.env?.GRAPHQL_URI
  //   ? process.env.GRAPHQL_URI
  //   : 'http://jadwal-main:4000/graphql';

  // const uri = 'https://jadwal-prod.herokuapp.com/graphql'; // desktop test
  // const uri = 'https://jadwal-web.herokuapp.com/graphql'; // desktop prod and vercel
  // const uri = 'http://jadwal-main:4000/graphql'; // localserver
  // const uri = process.env.GRAPHQL_URI; // webserver
  // env react
  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI,
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

  const isRTL = store?.lang === 'ar';
  const timeMsg = isRTL
    ? 'لقد انتهى وقت الإشتراك الخاص بك ، يرجى تجديد الإشتراك'
    : 'your subscription suspended!, please renew';
  const docsMsg = isRTL
    ? 'عدد الوثائق المسموحة لهذا الاشتراك قد نفذت ، يرجى رفع الإشتراك أو التواصل معنا'
    : 'you reach documents limit of your subscription, please upgrade or contact us';
  const usersMsg = isRTL
    ? 'عدد المستخدمين المسموحة بهم لهذا الاشتراك قد نفذت ، يرجى رفع الإشتراك أو التواصل معنا'
    : 'you reach users limit of your subscription, please upgrade or contact us';

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    try {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
          if (message === 'auth token error') {
            dispatch({ type: 'logout' });
          }
          if (message === 'package time limit exceeded') {
            dispatch({ type: 'setPackIssue', payload: timeMsg });
          }
          if (message === 'package docs limit exceeded') {
            dispatch({ type: 'setPackIssue', payload: docsMsg });
          }
          if (message === 'package users limit exceeded') {
            dispatch({ type: 'setPackIssue', payload: usersMsg });
          }
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      if (networkError) console.log(`[Network error]: ${networkError}`);
    } catch (error) {
      console.log(error);
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <GlobalContext.Provider value={{ store, dispatch, translate }}>
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <Layout user={store?.user}></Layout>
          </ThemeProvider>
        </StylesProvider>
      </GlobalContext.Provider>
    </ApolloProvider>
  );
}

export default App;
