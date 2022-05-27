/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { actionTimeFormatter, sentFormatter } from '../../Shared/colorFormat';

import { AlertLocal, SearchTable } from '../../components';
import { getColumns } from '../../common/columns';

import { Box, Button, useMediaQuery } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PageLayout from '../main/PageLayout';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupReminder from '../../pubups/PopupReminder';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateAction,
  updateReminder,
} from '../../graphql';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import ReminderContext from '../../contexts/reminder';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { useExpenseItems, useTemplate } from '../../hooks';
import getRemindersActions from '../../graphql/query/getRemindersActions';

export default function Reminders(props: any) {
  const { isRTL, words, menuitem, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [type, setType] = useState(2);

  const [rows, setRows] = useState([]);
  const [arows, setArows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const col = getColumns({ isRTL, words });
  const isMobile = useMediaQuery('(max-width:600px)');

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [col.time, col.title, col.employee, col.department, col.amount]
      : [
          col.time,
          col.title,
          col.resourse,
          col.employee,
          col.department,
          col.amount,
        ]
  );

  const [acolumns] = useState(
    tempoptions?.noTsk
      ? [col.time, col.title, col.employee, col.department, col.sent]
      : [
          col.time,
          col.title,
          col.resourse,
          col.employee,
          col.department,
          col.sent,
        ]
  );

  const { height } = useWindowDimensions();
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();
  const { expenseItems } = useExpenseItems();

  const {
    state: { currentDate, currentViewName, endDate },
    dispatch,
  } = useContext(ReminderContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadReminders, remindersData]: any = useLazyQuery(getReminders, {
    fetchPolicy: 'cache-and-network',
  });
  const [loadActions, actionsData]: any = useLazyQuery(getRemindersActions, {
    fetchPolicy: 'cache-and-network',
  });

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
        query: getRemindersActions,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
    ],
  };

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
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadActions({
      variables,
    });
  }, [start, end]);

  const [addReminder] = useMutation(createReminder, refresQuery);
  const [editReminder] = useMutation(updateReminder, refresQuery);
  const [removeReminder] = useMutation(deleteReminder, refresQuery);
  const [editRAction] = useMutation(updateAction, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeReminder({ variables: { _id } });
      if (res?.data?.deleteReminder?.ok === false) {
        if (res?.data?.deleteReminder?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (remindersData?.loading) {
      setLoading(true);
    }
    if (remindersData?.data?.getReminders?.data) {
      const { data } = remindersData.data.getReminders;
      const rdata = data.map((da: any) => {
        let time: any;
        let resourseNameAr: any;
        let resourseName: any;
        let departmentNameAr: any;
        let departmentName: any;
        let employeeNameAr: any;
        let employeeName: any;
        if (da?.resourseId) {
          const res = resourses.filter(
            (re: any) => re._id === da.resourseId
          )?.[0];
          resourseNameAr = res?.nameAr;
          resourseName = res?.name;
        }
        if (da?.departmentId) {
          const res = departments.filter(
            (re: any) => re._id === da.departmentId
          )?.[0];
          departmentNameAr = res?.nameAr;
          departmentName = res?.name;
        }
        if (da?.employeeId) {
          const res = employees.filter(
            (re: any) => re._id === da.employeeId
          )?.[0];
          employeeNameAr = res?.nameAr;
          employeeName = res?.name;
        }

        const rr = JSON.parse(da?.rruledata);
        if (rr) {
          const { all } = rr;
          const startms = start?.getTime();
          const endms = end?.getTime();
          all.map((tm: any) => {
            const date = new Date(tm).getTime();
            if (date > startms && date < endms) {
              time = new Date(tm);
            }
            return tm;
          });
        }
        return {
          ...da,
          resourseName,
          resourseNameAr,
          departmentNameAr,
          departmentName,
          employeeNameAr,
          employeeName,
          time,
        };
      });
      setRows(rdata);
      setLoading(false);
    }
  }, [remindersData]);

  useEffect(() => {
    if (actionsData?.loading) {
      setLoading(true);
    }
    if (actionsData?.data?.getRemindersActions?.data) {
      const { data } = actionsData.data.getRemindersActions;
      const rdata = data.map((da: any) => {
        let resourseNameAr: any;
        let resourseName: any;
        let departmentNameAr: any;
        let departmentName: any;
        let employeeNameAr: any;
        let employeeName: any;
        if (da?.resourseId) {
          const res = resourses.filter(
            (re: any) => re._id === da.resourseId
          )?.[0];
          resourseNameAr = res?.nameAr;
          resourseName = res?.name;
        }
        if (da?.departmentId) {
          const res = departments.filter(
            (re: any) => re._id === da.departmentId
          )?.[0];
          departmentNameAr = res?.nameAr;
          departmentName = res?.name;
        }
        if (da?.employeeId) {
          const res = employees.filter(
            (re: any) => re._id === da.employeeId
          )?.[0];
          employeeNameAr = res?.nameAr;
          employeeName = res?.name;
        }

        return {
          ...da,
          resourseName,
          resourseNameAr,
          departmentNameAr,
          departmentName,
          employeeNameAr,
          employeeName,
          time: da?.sendtime,
        };
      });
      setArows(rdata);
      setLoading(false);
    }
  }, [actionsData]);

  const refresh = () => {
    remindersData?.refetch();
    actionsData?.refetch();
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <Box
          display="flex"
          style={{
            position: 'absolute',
            zIndex: 111,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <DateNavigatorReports
            setStart={setStart}
            setEnd={setEnd}
            currentDate={currentDate}
            currentDateChange={currentDateChange}
            currentViewName={currentViewName}
            currentViewNameChange={currentViewNameChange}
            endDate={endDate}
            endDateChange={endDateChange}
            views={[1, 7, 30, 365, 1000]}
            isRTL={isRTL}
            words={words}
            theme={theme}
          ></DateNavigatorReports>

          <Box
            style={{
              padding: 0,
              margin: 0,
              paddingRight: 10,
              marginLeft: 40,
              marginRight: 40,
              borderRadius: 5,
            }}
          >
            <Button
              color="primary"
              variant={type === 2 ? 'contained' : 'outlined'}
              onClick={() => {
                setType(2);
              }}
              style={{
                marginLeft: 15,
                marginRight: 15,
                padding: 5,
                minWidth: 150,
              }}
            >
              {isRTL ? 'التذكيرات' : 'Reminders'}
            </Button>
            <Button
              color="primary"
              variant={type === 1 ? 'contained' : 'outlined'}
              onClick={() => {
                setType(1);
              }}
              style={{
                marginLeft: 15,
                marginRight: 15,
                padding: 5,
                minWidth: 150,
              }}
            >
              {isRTL ? 'ادارة التذكيرات' : 'Manage Reminders'}
            </Button>
          </Box>
        </Box>

        {type === 1 && (
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            {!isMobile && <SearchState />}
            <EditingState onCommitChanges={commitChanges} />

            <IntegratedSorting />
            {!isMobile && <IntegratedFiltering />}

            <VirtualTable
              height={height - 100}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={40}
            />

            <DataTypeProvider
              for={['time']}
              formatterComponent={actionTimeFormatter}
            ></DataTypeProvider>
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
            <TableHeaderRow showSortingControls />

            {!isMobile && <Toolbar />}
            {!isMobile && (
              <SearchPanel
                inputComponent={(props: any) => {
                  return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
                }}
              />
            )}
            <PopupEditing
              theme={theme}
              addAction={addReminder}
              editAction={editReminder}
            >
              <PopupReminder servicesproducts={expenseItems}></PopupReminder>
            </PopupEditing>
          </Grid>
        )}
        {type === 2 && (
          <Grid rows={arows} columns={acolumns} getRowId={getRowId}>
            <SortingState />
            <SearchState />

            <IntegratedSorting />
            <IntegratedFiltering />

            <VirtualTable
              height={height - 100}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={40}
            />

            <DataTypeProvider
              for={['time']}
              formatterComponent={actionTimeFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['sent']}
              formatterComponent={(props: any) =>
                sentFormatter({ ...props, editRAction })
              }
            ></DataTypeProvider>

            <TableHeaderRow showSortingControls />

            {<Toolbar />}

            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
          </Grid>
        )}
        {loading && <Loading isRTL={isRTL} />}
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Box>
    </PageLayout>
  );
}
