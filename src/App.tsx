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
import { getStoreItem, setStoreItem } from './store';
import { Layout } from './pages/main';
import { initStore, storeReducer } from './store';
import { GlobalContext } from './contexts';
import { useTranslate } from './hooks';
import { graphqlURI } from './constants';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
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

  const token = store ? store.token : null;

  const httpLink = createHttpLink({ uri: graphqlURI });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Jadwal ${token}` : '',
      },
    };
  });
  // console.log('store', store);
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    try {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) => {
          if (message === 'auth token error') {
            dispatch({ type: 'logout' });
          }
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
