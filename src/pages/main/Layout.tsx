/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Login from '../login';
import Content from './Content';
import EmplContent from './EmplContent';
import useCompany from '../../hooks/useCompany';
// import LoadingInline from '../../Shared/LoadingInline';

const Layout = ({ user }: any) => {
  const { company, editCompany, refreshcompany } = useCompany();

  const isEmployee = user?.isEmployee;

  return (
    <Router>
      {!user && <Login></Login>}
      {/* {user && !company && <LoadingInline></LoadingInline>} */}
      {/* {user && company && !isEmployee && ( */}
      {user && !isEmployee && (
        <Content
          company={company}
          editCompany={editCompany}
          refreshcompany={refreshcompany}
        ></Content>
      )}
      {/* {user && company && isEmployee && ( */}
      {user && isEmployee && (
        <EmplContent
          company={company}
          editCompany={editCompany}
          refreshcompany={refreshcompany}
        ></EmplContent>
      )}
    </Router>
  );
};
export default Layout;
