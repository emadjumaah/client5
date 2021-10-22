/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Login from '../login';
import { GlobalContext } from '../../contexts';
import Content from './Content';
import { jadwalready } from '../../common';
import EmplContent from './EmplContent';

const Layout = () => {
  const { store } = useContext(GlobalContext);
  const user = store?.user;
  const isEmployee = user?.isEmployee;

  jadwalready();

  return (
    <Router>
      {!user && <Login></Login>}
      {user && isEmployee && <EmplContent></EmplContent>}
      {user && !isEmployee && <Content></Content>}
    </Router>
  );
};
export default Layout;
