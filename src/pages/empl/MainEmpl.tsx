/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  MonthView,
  DayView,
  CurrentTimeIndicator,
  DragDropProvider,
  EditRecurrenceMenu,
  Resources,
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useContext, useEffect, useState } from 'react';
import { getCalendarResourses } from '../../common/helpers';
import { commitAppointmentChanges, roles } from '../../common';
import { AppointForm } from '../calendar/common/AppointForm';
import { RenderToolTip } from '../calendar/common/AppointTooltip';
import { AppointTooltipEmpl } from '../calendar/common/AppointTooltipEmpl';
import { AppointmentContent } from '../calendar/common';
import { CommandAppointment } from '../../Shared';
import { useLazyQuery, useMutation } from '@apollo/client';
import { createEvent, deleteEvent, updateEvent } from '../../graphql';
import { Box, Grid, useMediaQuery } from '@material-ui/core';
import { getStartEndEventView } from '../../common/time';
import { DateNavigator } from '../../components';
import { CalendarContext } from '../../contexts';
import PopupLayoutBox from '../main/PopupLayoutBox';
import { eventStatus } from '../../constants';
import useTasks from '../../hooks/useTasks';
import getEmplEvents from '../../graphql/query/getEmplEvents';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const MainEmpl = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [resourseData, setResourseData]: any = useState([]);
  const [mainResourceName]: any = useState('status');

  const [rows, setRows] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');

  const {
    state: { currentDate, currentViewName, departvalue, emplvalue, status },
    dispatch,
  } = useContext(CalendarContext);
  const { tasks } = useTasks();
  const { height } = useWindowDimensions();

  const {
    departments,
    employees,
    resourses,
    calendar,
    isRTL,
    words,
    services,
    company,
    theme,
    user,
  } = props;

  const refresQuery = {
    refetchQueries: [
      {
        query: getEmplEvents,
        variables: {
          start,
          end,
        },
      },
    ],
  };

  const [addEvent] = useMutation(createEvent, refresQuery);
  const [editEvent] = useMutation(updateEvent, refresQuery);
  const [removeEvent] = useMutation(deleteEvent, refresQuery);

  const [getCalEvents, evnData]: any = useLazyQuery(getEmplEvents);

  useEffect(() => {
    const eventsData = evnData?.data?.['getEmplEvents']?.data || [];
    const events =
      eventsData.length > 0
        ? eventsData.map((ap: any) => {
            return {
              ...ap,
              startDate: new Date(ap.startDate),
              endDate: new Date(ap.endDate),
              start: ap.startDate,
              end: ap.endDate,
            };
          })
        : [];

    setRows(events);
  }, [evnData]);

  useEffect(() => {
    const startend: any = getStartEndEventView({
      time: currentDate,
      view: currentViewName,
    });
    setStart(startend.start);
    setEnd(startend.end);
    const variables = {
      departmentId: departvalue ? departvalue._id : undefined,
      employeeId: emplvalue ? emplvalue._id : undefined,
      status: status ? status.id : undefined,
      start: startend.start,
      end: startend.end,
    };
    getCalEvents({ variables });
  }, [
    currentDate,
    currentViewName,
    departvalue,
    emplvalue,
    getCalEvents,
    status,
  ]);

  useEffect(() => {
    let res: any;
    if (mainResourceName === 'employeeId') {
      res = employees;
    }
    if (mainResourceName === 'status') {
      res = eventStatus;
    }
    if (mainResourceName === 'departmentId') {
      res = departments;
    }
    const resourses = getCalendarResourses(res, mainResourceName, 'Data');
    setResourseData(resourses);
  }, [mainResourceName, departments]);

  const isMonth = currentViewName === 'Month';
  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const commitChanges = async ({ added, changed, deleted }: any) => {
    commitAppointmentChanges({
      added,
      changed,
      deleted,
      addEvent,
      editEvent,
      removeEvent,
      isRTL,
    });
  };

  const title = isRTL ? '???????????? ????????????' : 'Appointment';
  return (
    <Box
      style={{
        backgroundColor: '#fff',
        marginTop: isMobile ? 47 : undefined,
        height: isMobile ? height - 47 : height - 10,
        overflow: 'auto',
      }}
    >
      <Box style={{ margin: 10 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={4}>
            <DateNavigator
              setStart={setStart}
              setEnd={setEnd}
              isRTL={isRTL}
              words={words}
              theme={theme}
              currentViewNameChange={currentViewNameChange}
              currentDateChange={currentDateChange}
              currentViewName={currentViewName}
              currentDate={currentDate}
              views={isMobile ? [1, 3, 7] : [1, 3, 7, 30]}
            ></DateNavigator>
          </Grid>
          <Grid item xs={12} md={8}></Grid>
        </Grid>
        <Box style={{ margin: 0 }}>
          <Scheduler
            data={rows}
            height={isMonth ? 'auto' : isMobile ? height - 120 : height - 90}
            firstDayOfWeek={6}
            locale={isRTL ? 'ar' : 'en'}
          >
            {!isMonth && <EditingState onCommitChanges={commitChanges} />}
            {!isMonth && (
              <EditRecurrenceMenu
                messages={{
                  current: isRTL ? '???????????? ???????????? ??????' : 'This appointment',
                  currentAndFollowing: isRTL
                    ? '???????????? ???????????? ?????????????????? ??????????????'
                    : 'This and following appointments',
                  all: isRTL ? '???? ????????????????' : 'All appointments',
                  menuEditingTitle: isRTL
                    ? '?????????? ???????? ??????????'
                    : 'Edit recurring appointment',
                  menuDeletingTitle: isRTL
                    ? '?????? ???????? ??????????'
                    : 'Delete recurring appointment',
                  cancelButton: isRTL ? '??????????' : 'Cancel',
                  commitButton: isRTL ? '??????????' : 'OK',
                }}
              />
            )}
            {/* {!isMonth && <IntegratedEditing />} */}
            <ViewState
              currentViewName={currentViewName}
              onCurrentViewNameChange={currentViewNameChange}
              currentDate={currentDate}
              onCurrentDateChange={currentDateChange}
            />
            <DayView
              cellDuration={calendar ? calendar?.duration : 30}
              startDayHour={calendar ? calendar?.start : 8.5}
              endDayHour={calendar ? calendar?.end : 21.5}
            />
            <DayView
              name="3Days"
              displayName="3 Days"
              intervalCount={3}
              cellDuration={calendar ? calendar?.duration : 30}
              startDayHour={calendar ? calendar?.start : 8.5}
              endDayHour={calendar ? calendar?.end : 21.5}
            />
            <WeekView
              name="Week"
              displayName="Week"
              cellDuration={calendar ? calendar?.duration : 30}
              startDayHour={calendar ? calendar?.start : 8.5}
              endDayHour={calendar ? calendar?.end : 21.5}
            />
            {!isMobile && <MonthView intervalCount={1} />}
            {/* <Toolbar /> */}
            <Appointments appointmentContentComponent={AppointmentContent} />
            <Resources
              data={resourseData}
              mainResourceName={mainResourceName}
            />
            <AppointmentTooltip
              showCloseButton
              showOpenButton={roles.isEditor() && !isMobile ? true : false}
              // showDeleteButton
              visible={visible}
              onVisibilityChange={() => setVisible(!visible)}
              contentComponent={({ appointmentData }) => (
                <Box>
                  {isMobile ? (
                    <AppointTooltipEmpl
                      appointmentData={appointmentData}
                      setVisible={setVisible}
                      departments={departments}
                      employees={employees}
                      resourses={resourses}
                      services={services}
                      editEvent={editEvent}
                      company={company}
                      theme={theme}
                      viewonly={isMobile}
                      tasks={tasks}
                      updateEvent={updateEvent}
                    ></AppointTooltipEmpl>
                  ) : (
                    <RenderToolTip
                      appointmentData={appointmentData}
                      setVisible={setVisible}
                      departments={departments}
                      employees={employees}
                      resourses={resourses}
                      services={services}
                      editEvent={editEvent}
                      company={company}
                      theme={theme}
                      viewonly={isMobile}
                      tasks={tasks}
                    ></RenderToolTip>
                  )}
                </Box>
              )}
            />
            {/* {!isMonth && <AppointmentForm />} */}
            {!isMonth && (
              <AppointmentForm
                overlayComponent={(args: any) => (
                  <PopupLayoutBox
                    isRTL={isRTL}
                    theme={theme}
                    alrt={{}}
                    open={args.visible || false}
                    title={title}
                    onSubmit={commitChanges}
                    mt={0}
                    mb={50}
                    {...args}
                    onClose={args.onHide}
                    isMobile={isMobile}
                  ></PopupLayoutBox>
                )}
                basicLayoutComponent={(pr: any) => (
                  <AppointForm
                    departments={departments}
                    employees={employees}
                    resourses={resourses}
                    servicesproducts={services}
                    theme={theme}
                    tasks={tasks.filter(
                      (ts: any) => ts.employeeId === user?.employeeId
                    )}
                    isMobile={isMobile}
                    {...pr}
                  ></AppointForm>
                )}
                commandButtonComponent={CommandAppointment}
              />
            )}
            {!isMobile && <AllDayPanel />}
            {!isMonth && <DragDropProvider></DragDropProvider>}
            <CurrentTimeIndicator shadePreviousCells></CurrentTimeIndicator>
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default MainEmpl;
