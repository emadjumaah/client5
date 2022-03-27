import React from 'react';
// HashRouter for electron to work properly
import { BrowserRouter } from 'react-router-dom';
import Auth from '../auth';
import Content from './Content';
import EmplContent from './EmplContent';

const Layout = ({ user }: any) => {
  const isEmployee = user?.isEmployee;

  return (
    <BrowserRouter>
      {!user && <Auth></Auth>}
      {user && !isEmployee && <Content></Content>}
      {user && isEmployee && <EmplContent></EmplContent>}
    </BrowserRouter>
  );
};
export default Layout;
