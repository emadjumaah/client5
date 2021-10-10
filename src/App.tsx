/* eslint-disable import/first */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
require("dotenv").config();
import React, { useEffect, useReducer } from "react";
import { ThemeProvider } from "@material-ui/core";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { ApolloProvider } from "@apollo/client";
import { createThem } from "./themes";
import { client } from "./graphql";
import { getStoreItem, setStoreItem } from "./store";
import { Layout } from "./pages/main";
import { initStore, storeReducer } from "./store";
import { GlobalContext } from "./contexts";
import { useTranslate } from "./hooks";

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  const storeState = getStoreItem("store", initStore);
  const [store, dispatch] = useReducer(
    storeReducer,
    storeState ? storeState : initStore
  );
  const theme = createThem({ lang: store.lang, themeId: store.themeId });
  const translate = useTranslate(store.lang);
  useEffect(() => {
    setStoreItem("store", store);
  }, [store]);

  return (
    <ApolloProvider client={client}>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <GlobalContext.Provider value={{ store, dispatch, translate }}>
            <Layout></Layout>
          </GlobalContext.Provider>
        </ThemeProvider>
      </StylesProvider>
    </ApolloProvider>
  );
}

export default App;
