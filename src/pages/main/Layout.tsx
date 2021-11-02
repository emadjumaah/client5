import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Login from '../login';
import Content from './Content';
import EmplContent from './EmplContent';

const Layout = ({ user }: any) => {
  const isEmployee = user?.isEmployee;

  return (
    <Router>
      {!user && <Login></Login>}
      {user && !isEmployee && <Content></Content>}
      {user && isEmployee && <EmplContent></EmplContent>}
    </Router>
  );
};
export default Layout;
