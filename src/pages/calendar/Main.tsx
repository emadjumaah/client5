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
} from '@devexpress/dx-react-scheduler-material-ui';
import { useContext, useEffect, useState } from 'react';
import { AppointForm } from './common/AppointForm';
import { commitAppointmentChanges, roles } from '../../common';
import { RenderToolTip } from './common/AppointTooltip';
import { AppointmentContent } from './common';
import { CommandAppointment } from '../../Shared';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from '../../graphql';
import { Box, Grid, Hidden, useMediaQuery } from '@material-ui/core';
import EventsCalFilter from '../../Shared/EventsCalFilter';
import { getStartEndEventView } from '../../common/time';
import { DateNavigator } from '../../components';
import { CalendarContext } from '../../contexts';
import PopupLayoutBox from '../main/PopupLayoutBox';
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
  const { calendar, isRTL, words, company, theme } = props;
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
            const end = new Date(ap.endDate);
            if (ap.startDate === ap.endDate) {
              end.setHours(end.getHours() + 1);
            }

            return {
              ...ap,
              startDate: new Date(ap.startDate),
              endDate: end,
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
    refresh();
  }, []);

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
        height: isMobile ? height - 50 : height,
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
                  loading={evnData?.loading}
                ></EventsCalFilter>
              </Box>
            </Hidden>
          </Grid>
        </Grid>
        <Box style={{ margin: 0 }}>
          <Scheduler
            data={rows}
            height={isMonth ? 'auto' : isMobile ? height - 120 : height - 85}
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
            <MonthView intervalCount={1} />
            {/* <Toolbar /> */}
            <Appointments appointmentContentComponent={AppointmentContent} />
            <Resources
              data={resourseData}
              mainResourceName={mainResourceName}
            />
            <AppointmentTooltip
              showCloseButton
              // showOpenButton={ isEditor ? true : false} // TODO:
              showOpenButton
              showDeleteButton={roles.isOperateAdmin()}
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
            {!isMonth && <DragDropProvider></DragDropProvider>}
            <CurrentTimeIndicator shadePreviousCells></CurrentTimeIndicator>
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default Main;
