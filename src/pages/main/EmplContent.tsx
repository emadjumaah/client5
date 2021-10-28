/* eslint-disable no-var */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useReducer, useState } from 'react';
import { fade, useTheme } from '@material-ui/core/styles';
import { Box, CssBaseline } from '@material-ui/core';
import { Route } from 'react-router-dom';
import { AppDrawer } from '../../components';
import { emplmenu } from '../../constants';
import {
  EventsContext,
  eventsReducer,
  GlobalContext,
  initEventsContext,
} from '../../contexts';
import { layoutClasses } from '../../themes';
import Options from '../options';
import { GContextTypes } from '../../types';

import { useServices } from '../../hooks';
import PageLayout from './PageLayout';
import { CalendarContext } from '../../contexts/calendar';
import { initCalendar, calendarReducer } from '../../contexts';

import {
  initTasksContext,
  tasksReducer,
} from '../../contexts/tasks/tasksReducer';
import TasksContext from '../../contexts/tasks';
import React from 'react';
import { isEmployee } from '../../common/roles';
import AlertWithClose from '../../components/fields/AlertWithClose';
import MainCalendarEmpl from '../empl/MainCalendarEmpl';
import AppointmentsEmpl from '../empl/AppointmentsEmpl';
import TasksEmpl from '../adds/TasksEmpl';

const EmplContent = ({ company, editCompany, refreshcompany }) => {
  const classes = layoutClasses();
  const [menuitem, setMenuitem] = useState(emplmenu[0]);

  const theme = useTheme();

  const { services, addService, editService } = useServices();

  const {
    store: { user, calendar, network, packIssue, packIssueMsg },
    dispatch,
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const logout = () => {
    dispatch({ type: 'logout' });
  };

  const isEditor = isEmployee(user);

  const [calendarStore, calendarDispatch] = useReducer(
    calendarReducer,
    initCalendar
  );

  const [eventsStore, eventsDispatch] = useReducer(
    eventsReducer,
    initEventsContext
  );

  const [tasksStore, tasksDispatch] = useReducer(
    tasksReducer,
    initTasksContext
  );

  return (
    <Box
      className={classes.root}
      dir={isRTL ? 'rtl' : undefined}
      display="flex"
      style={{
        flex: 1,
        backgroundColor: fade(theme.palette.info.light, 0.05),
      }}
    >
      <CssBaseline />
      <AppDrawer
        isRTL={isRTL}
        setMenuitem={setMenuitem}
        menuitem={menuitem}
        user={user}
        menu={emplmenu}
        logout={logout}
        network={network}
      ></AppDrawer>
      <main className={classes.content}>
        <div>
          <Route
            path="/"
            exact
            component={() => (
              <CalendarContext.Provider
                value={{ state: calendarStore, dispatch: calendarDispatch }}
              >
                <MainCalendarEmpl
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  isEditor={isEditor}
                  calendar={calendar}
                  company={company}
                  services={services}
                  addService={addService}
                  editService={editService}
                  user={user}
                ></MainCalendarEmpl>
              </CalendarContext.Provider>
            )}
          />

          <Route
            path="/appointments"
            component={() => (
              <EventsContext.Provider
                value={{ state: eventsStore, dispatch: eventsDispatch }}
              >
                <AppointmentsEmpl
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                  company={company}
                  servicesproducts={services}
                  user={user}
                ></AppointmentsEmpl>
              </EventsContext.Provider>
            )}
          />
          <Route
            path="/tasks"
            component={() => (
              <TasksContext.Provider
                value={{ state: tasksStore, dispatch: tasksDispatch }}
              >
                <TasksEmpl
                  menuitem={menuitem}
                  isRTL={isRTL}
                  words={words}
                  isEditor={isEditor}
                  theme={theme}
                  company={company}
                  servicesproducts={services}
                ></TasksEmpl>
              </TasksContext.Provider>
            )}
          />

          <Route
            path="/options"
            component={() => (
              <PageLayout
                menuitem={menuitem}
                isRTL={isRTL}
                words={words}
                isEditor={false}
                theme={theme}
                refresh={refreshcompany}
                editCompany={editCompany}
                company={company}
              >
                <Options></Options>
              </PageLayout>
            )}
          />
        </div>
        <AlertWithClose
          open={packIssue}
          dispatch={dispatch}
          isRTL={isRTL}
          msg={packIssueMsg}
          onClose={() => dispatch({ type: 'closePackIssue' })}
        ></AlertWithClose>
      </main>
    </Box>
  );
};
export default EmplContent;
