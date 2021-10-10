/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from "react";
import { HashRouter as Router } from "react-router-dom";
import Login from "../login";
import { GlobalContext } from "../../contexts";
import Content from "./Content";
import { jadwalready } from "../../common";

const Layout = () => {
  const { store } = useContext(GlobalContext);
  const user = store?.user;
  const lang = store?.lang;

  jadwalready();

  return (
    <Router>
      {!user && <Login lang={lang}></Login>}
      {user && <Content></Content>}
    </Router>
  );
};
export default Layout;
