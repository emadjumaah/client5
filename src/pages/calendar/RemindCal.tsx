/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  MonthView,
  DayView,
  CurrentTimeIndicator,
  EditRecurrenceMenu,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useContext, useEffect, useState } from 'react';
import { AppointmentContent } from './common';
import { Box, Grid, useMediaQuery } from '@material-ui/core';
import { DateNavigator } from '../../components';
import { CalendarContext } from '../../contexts';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { commitReminderChanges } from '../../common/calendar';
import { ReminderTooltip } from './common/ReminderTooltip';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from '../../graphql';
import getNotificationsList from '../../graphql/query/getNotificationsList';

const RemindCal = (props: any) => {
  const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const isMobile = useMediaQuery('(max-width:600px)');
  const { isRTL, words, company, theme } = props;
  const {
    state: { currentDate, currentViewName },
    dispatch,
  } = useContext(CalendarContext);
  const { height } = useWindowDimensions();

  const [loadReminders, remindersData]: any = useLazyQuery(getReminders, {
    // fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadReminders({
      variables,
    });
  }, [start, end]);

  useEffect(() => {
    if (remindersData?.data?.getReminders?.data) {
      const { data } = remindersData.data.getReminders;
      const updatedReminders =
        data?.length > 0
          ? data.map((ap: any) => {
              const startDate = new Date(ap.runtime);
              const endDate = new Date(ap.runtime);
              endDate.setMinutes(endDate.getMinutes() + 30);
              return {
                ...ap,
                startDate,
                endDate,
                start: startDate,
                end: endDate,
              };
            })
          : [];
      setRows(updatedReminders);
    }
  }, [remindersData]);

  const refresQuery = {
    refetchQueries: [
      {
        query: getReminders,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getNotificationsList,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
    ],
  };

  const [addReminder] = useMutation(createReminder, refresQuery);
  const [editReminder] = useMutation(updateReminder, refresQuery);
  const [removeReminder] = useMutation(deleteReminder, refresQuery);

  const isMonth = currentViewName === 'Month';
  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  const commitChanges = async ({ added, changed, deleted }: any) => {
    commitReminderChanges({
      added,
      changed,
      deleted,
      addEvent: addReminder,
      editEvent: editReminder,
      removeEvent: removeReminder,
      isRTL,
    });
  };

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
            <DayView cellDuration={30} startDayHour={0.5} endDayHour={23.5} />
            <DayView
              name="3Days"
              displayName="3 Days"
              intervalCount={3}
              cellDuration={30}
              startDayHour={0.5}
              endDayHour={23.5}
            />
            <WeekView
              name="Week"
              displayName="Week"
              cellDuration={30}
              startDayHour={0.5}
              endDayHour={23.5}
            />
            <MonthView intervalCount={1} />
            {/* <Toolbar /> */}
            <Appointments appointmentContentComponent={AppointmentContent} />
            <AppointmentTooltip
              showCloseButton
              showOpenButton // TODO:
              showDeleteButton
              visible={visible}
              onVisibilityChange={() => setVisible(!visible)}
              contentComponent={({ appointmentData }) => (
                <ReminderTooltip
                  appointmentData={appointmentData}
                  setVisible={setVisible}
                  editEvent={editReminder}
                  company={company}
                  theme={theme}
                  viewonly={isMobile}
                ></ReminderTooltip>
              )}
            />
            {/* {!isMonth && <AppointmentForm />} */}
            {/* {!isMonth && (
              <AppointmentForm
                overlayComponent={(args: any) => (
                  <PopupLayoutBox
                    isRTL={isRTL}
                    theme={theme}
                    alrt={{}}
                    open={args.visible || false}
                    title={isRTL ? 'تذكير' : 'Reminder'}
                    onSubmit={commitChanges}
                    mt={0}
                    mb={50}
                    {...args}
                    onClose={args.onHide}
                    isMobile={isMobile}
                  ></PopupLayoutBox>
                )}
                basicLayoutComponent={(pr: any) => (
                  <ReminderForm
                    theme={theme}
                    isMobile={isMobile}
                    {...pr}
                  ></ReminderForm>
                )}
                commandButtonComponent={CommandAppointment}
              />
            )}
            {!isMonth && <DragDropProvider></DragDropProvider>} */}
            <CurrentTimeIndicator shadePreviousCells></CurrentTimeIndicator>
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default RemindCal;
