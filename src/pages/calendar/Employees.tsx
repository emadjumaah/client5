/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Appointments,
  AppointmentTooltip,
  DayView,
  CurrentTimeIndicator,
  Resources,
  GroupingPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useContext, useEffect, useState } from 'react';

import { RenderToolTip } from './common/AppointTooltip';
import { AppointmentContent } from './common';
import { useLazyQuery } from '@apollo/client';
import { getEvents } from '../../graphql';
import {
  Box,
  fade,
  FormControlLabel,
  Grid,
  Hidden,
  IconButton,
  Radio,
  RadioGroup,
  useMediaQuery,
} from '@material-ui/core';
import { getStartEndEventView } from '../../common/time';
import { DateNavigator } from '../../components';
import LoadingInline from '../../Shared/LoadingInline';
import CalendarReportContext from '../../contexts/calendarReport';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import { eventStatus } from '../../constants';
import { getCalendarResourses } from '../../common/helpers';
import useTasks from '../../hooks/useTasks';

const EmployeesAppoints = (props: any) => {
  const [resourseData, setResourseData] = useState<any>([]);

  const [visible, setVisible] = useState(false);

  const [rows, setRows] = useState([]);

  const {
    state: { currentDate, currentViewName, mainResourceName },
    dispatch,
  } = useContext(CalendarReportContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const { tasks } = useTasks();

  const [getCalEvents, evnData] = useLazyQuery(getEvents);
  const {
    theme,
    isRTL,
    words,
    services,
    company,
    calendar,
    employees,
    departments,
    customers,
  } = props;

  useEffect(() => {
    const resourses = getCalendarResourses(
      mainResourceName === 'employeeId' ? employees : eventStatus,
      mainResourceName,
      'Data',
      isRTL
    );
    setResourseData(resourses);
  }, [employees]);

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

  const grouping = [
    {
      resourceName: mainResourceName,
    },
  ];

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     refresh();
  //   }, 10000);
  //   return () => clearInterval(id);
  // });

  useEffect(() => {
    const startend: any = getStartEndEventView({
      time: currentDate,
      view: currentViewName,
    });
    const variables = {
      start: startend.start,
      end: startend.end,
    };
    getCalEvents({
      variables,
    });
  }, [currentDate, currentViewName]);

  const setMainResourceNameDispatch = (value: any) => {
    dispatch({ type: 'setMainResourceName', payload: value });

    const resourses = getCalendarResourses(
      value === 'employeeId' ? employees : eventStatus,
      value,
      'Data'
    );
    setResourseData(resourses);
  };

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };
  console.log();

  if (
    !employees ||
    employees.length === 0 ||
    !resourseData ||
    !resourseData?.[0]?.instances ||
    resourseData?.[0]?.instances?.length === 0
  ) {
    return <LoadingInline></LoadingInline>;
  }

  return (
    <Box
      style={{
        backgroundColor: '#fff',
        marginTop: isMobile ? 47 : undefined,
        // height: window.innerHeight - 60,
        overflow: 'auto',
      }}
    >
      <Box style={{ margin: 10 }}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={4}>
            <DateNavigator
              setStart={() => null}
              setEnd={() => null}
              isRTL={isRTL}
              words={words}
              theme={theme}
              currentViewNameChange={currentViewNameChange}
              currentDateChange={currentDateChange}
              currentViewName={currentViewName}
              currentDate={currentDate}
              views={[1, 3]}
            ></DateNavigator>
          </Grid>
          <Grid item xs={12} md={8}>
            <Hidden xsDown implementation="css">
              <RadioGroup
                aria-label="Views"
                name="views"
                row
                value={mainResourceName}
                onChange={(e: any) =>
                  setMainResourceNameDispatch(e.target.value)
                }
              >
                <FormControlLabel
                  value={'employeeId'}
                  control={<Radio color="primary" />}
                  label={isRTL ? 'الموظف' : 'Employee'}
                />

                <FormControlLabel
                  value="status"
                  control={<Radio color="primary" />}
                  label={isRTL ? 'الحالة' : 'Status'}
                />
              </RadioGroup>
              {refresh && (
                <Box style={{ position: 'absolute', top: 10, left: 20 }}>
                  <IconButton
                    style={{
                      backgroundColor: fade(theme.palette.secondary.main, 0.5),
                      padding: 7,
                    }}
                    onClick={refresh}
                  >
                    <RefreshOutlinedIcon
                      style={{ fontSize: 24 }}
                      color="primary"
                    ></RefreshOutlinedIcon>
                  </IconButton>
                </Box>
              )}
            </Hidden>
          </Grid>
        </Grid>
        <Box style={{ overflow: 'auto', width: window.innerWidth - 270 }}>
          <Scheduler
            data={rows}
            height={isMobile ? window.innerHeight : window.innerHeight - 70}
            firstDayOfWeek={6}
            locale={isRTL ? 'ar' : 'en'}
          >
            <GroupingState grouping={grouping} />
            <ViewState
              currentViewName={currentViewName}
              onCurrentViewNameChange={currentViewNameChange}
              currentDate={currentDate}
              onCurrentDateChange={currentDateChange}
            />
            <DayView
              name="Day"
              displayName="Day"
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
            {/* <Toolbar /> */}
            <Appointments appointmentContentComponent={AppointmentContent} />
            <Resources
              data={resourseData}
              mainResourceName={mainResourceName}
            />
            <IntegratedGrouping />
            <AppointmentTooltip
              showCloseButton
              visible={visible}
              onVisibilityChange={() => setVisible(!visible)}
              contentComponent={({ appointmentData }) => (
                <RenderToolTip
                  appointmentData={appointmentData}
                  setVisible={setVisible}
                  departments={departments}
                  employees={employees}
                  customers={customers}
                  services={services}
                  editEvent={() => null}
                  company={company}
                  tasks={tasks}
                  viewonly
                ></RenderToolTip>
              )}
            />
            <GroupingPanel />
            <CurrentTimeIndicator shadePreviousCells></CurrentTimeIndicator>
          </Scheduler>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeesAppoints;
