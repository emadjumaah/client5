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
import { AppointForm } from './common/AppointForm';
// import { getResourses } from '../../common/helpers';
import { commitAppointmentChanges } from '../../common';
import { RenderToolTip } from './common/AppointTooltip';
import { AppointmentContent } from './common';
import { CommandAppointment } from '../../Shared';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createEvent,
  deleteEvent,
  getCustomers,
  getDepartments,
  getEmployees,
  getEvents,
  getLandingChartData,
  getProjects,
  getResourses,
  updateEvent,
} from '../../graphql';
import { Box, Grid, Hidden, useMediaQuery } from '@material-ui/core';
import EventsCalFilter from '../../Shared/EventsCalFilter';
import { getStartEndEventView } from '../../common/time';
import { DateNavigator } from '../../components';
import { CalendarContext } from '../../contexts';
import PopupLayoutBox from '../main/PopupLayoutBox';
import getTasks from '../../graphql/query/getTasks';
import { getPopupGeneralTitle } from '../../constants/menu';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const Main = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [resourseData, setResourseData]: any = useState([]);
  const [mainResourceName, setMainResourceName]: any = useState(null);

  const [rows, setRows] = useState([]);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { calendar, isRTL, words, company, isEditor, theme } = props;
  const {
    state: { currentDate, currentViewName, departvalue, emplvalue, status },
    dispatch,
  } = useContext(CalendarContext);
  const { height } = useWindowDimensions();

  const refresQuery = {
    refetchQueries: [
      {
        query: getEvents,
        variables: {
          departmentId: departvalue ? departvalue._id : undefined,
          employeeId: emplvalue ? emplvalue._id : undefined,
          status: status ? status.id : undefined,
          start,
          end,
        },
      },
      {
        query: getLandingChartData,
      },
      {
        query: getTasks,
      },
      {
        query: getCustomers,
      },
      {
        query: getEmployees,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getDepartments,
        variables: { isRTL, depType: 1 },
      },
      {
        query: getResourses,
        variables: { isRTL, resType: 1 },
      },
      {
        query: getProjects,
      },
      {
        query: getTasks,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
    ],
  };

  const [addEvent] = useMutation(createEvent, refresQuery);
  const [editEvent] = useMutation(updateEvent, refresQuery);
  const [removeEvent] = useMutation(deleteEvent, refresQuery);

  const [getCalEvents, evnData]: any = useLazyQuery(getEvents);

  useEffect(() => {
    const eventsData = evnData?.data?.['getEvents']?.data || [];
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

  const refresh = () => {
    if (evnData?.refetch) {
      evnData.refetch();
    }
  };

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

  // useEffect(() => {
  //   let res: any;
  //   if (mainResourceName === 'employeeId') {
  //     res = employees;
  //   }
  //   if (mainResourceName === 'status') {
  //     res = eventStatus;
  //   }
  //   if (mainResourceName === 'departmentId') {
  //     res = departments;
  //   }
  //   const resourses = getCalendarResourses(res, mainResourceName, 'Data');
  //   setResourseData(resourses);
  // }, [mainResourceName, departments]);

  const setDepartvalueDispatch = (value: any) => {
    dispatch({ type: 'setDepartvalue', payload: value });
  };
  const setEmplvalueDispatch = (value: any) => {
    dispatch({ type: 'setEmplvalue', payload: value });
  };
  const setStatusDispatch = (value: any) => {
    dispatch({ type: 'setStatus', payload: value });
  };

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

  const title = getPopupGeneralTitle('appointment');
  return (
    <Box
      style={{
        backgroundColor: '#fff',
        marginTop: isMobile ? 47 : undefined,
        height: height,
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
              views={[1, 3, 7, 30]}
            ></DateNavigator>
          </Grid>
          <Grid item xs={12} md={8}>
            <Hidden xsDown implementation="css">
              <Box style={{ marginBottom: 3 }}>
                <EventsCalFilter
                  count={rows.length}
                  departvalue={departvalue}
                  setDepartvalue={setDepartvalueDispatch}
                  emplvalue={emplvalue}
                  setEmplvalue={setEmplvalueDispatch}
                  status={status}
                  setStatus={setStatusDispatch}
                  setMainResourceName={setMainResourceName}
                  mainResourceName={mainResourceName}
                  setResourseData={setResourseData}
                  isRTL={isRTL}
                  words={words}
                  theme={theme}
                  refresh={refresh}
                ></EventsCalFilter>
              </Box>
            </Hidden>
          </Grid>
        </Grid>
        <Box style={{ margin: 0 }}>
          <Scheduler
            data={rows}
            height={isMonth ? 'auto' : isMobile ? height : height - 85}
            firstDayOfWeek={6}
            locale={isRTL ? 'ar' : 'en'}
          >
            {!isMonth && <EditingState onCommitChanges={commitChanges} />}
            {!isMonth && (
              <EditRecurrenceMenu
                messages={{
                  current: isRTL ? 'الموعد الحالي فقط' : 'This appointment',
                  currentAndFollowing: isRTL
                    ? 'الموعد الحالي والمواعيد اللاحقة'
                    : 'This and following appointments',
                  all: isRTL ? 'كل المواعيد' : 'All appointments',
                  menuEditingTitle: isRTL
                    ? 'تعديل موعد متكرر'
                    : 'Edit recurring appointment',
                  menuDeletingTitle: isRTL
                    ? 'حذف موعد متكرر'
                    : 'Delete recurring appointment',
                  cancelButton: isRTL ? 'الغاء' : 'Cancel',
                  commitButton: isRTL ? 'تعديل' : 'OK',
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
            <MonthView intervalCount={1} />
            {/* <Toolbar /> */}
            <Appointments appointmentContentComponent={AppointmentContent} />
            <Resources
              data={resourseData}
              mainResourceName={mainResourceName}
            />
            <AppointmentTooltip
              showCloseButton
              showOpenButton={isEditor ? true : false}
              // showDeleteButton
              visible={visible}
              onVisibilityChange={() => setVisible(!visible)}
              contentComponent={({ appointmentData }) => (
                <RenderToolTip
                  appointmentData={appointmentData}
                  setVisible={setVisible}
                  editEvent={editEvent}
                  company={company}
                  theme={theme}
                  viewonly={isMobile}
                ></RenderToolTip>
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
                    theme={theme}
                    isMobile={isMobile}
                    {...pr}
                  ></AppointForm>
                )}
                commandButtonComponent={CommandAppointment}
              />
            )}
            <AllDayPanel />
            {!isMonth && <DragDropProvider></DragDropProvider>}
            <CurrentTimeIndicator shadePreviousCells></CurrentTimeIndicator>
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
