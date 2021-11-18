import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from '../auth';
import Content from './Content';
import EmplContent from './EmplContent';

const Layout = ({ user }: any) => {
  const isEmployee = user?.isEmployee;

  return (
    <Router>
      {!user && <Auth></Auth>}
      {user && !isEmployee && <Content></Content>}
      {user && isEmployee && <EmplContent></EmplContent>}
    </Router>
  );
};
export default Layout;
