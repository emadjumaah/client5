/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Login from '../login';
import Content from './Content';
import EmplContent from './EmplContent';
import useCompany from '../../hooks/useCompany';
import LoadingInline from '../../Shared/LoadingInline';

const Layout = ({ user }: any) => {
  const { company, editCompany, refreshcompany } = useCompany();

  const isEmployee = user?.isEmployee;
  if (!company && user) {
    return <LoadingInline></LoadingInline>;
  } else {
    return (
      <Router>
        {!user && <Login></Login>}
        {user && !isEmployee && (
          <Content
            company={company}
            editCompany={editCompany}
            refreshcompany={refreshcompany}
          ></Content>
        )}
        {user && isEmployee && (
          <EmplContent
            company={company}
            editCompany={editCompany}
            refreshcompany={refreshcompany}
          ></EmplContent>
        )}
      </Router>
    );
  }
};
export default Layout;
