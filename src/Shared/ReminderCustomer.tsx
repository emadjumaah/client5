/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import {
  Box,
  Button,
  fade,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import {
  DataTypeProvider,
  EditingState,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import { Getter } from '@devexpress/dx-react-core';
import { getColumns } from '../common/columns';
import {
  actionTimeFormatter,
  currencyFormatter,
  sentFormatter,
} from './colorFormat';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  createReminder,
  deleteReminder,
  getCustomers,
  getDepartments,
  getEmployees,
  getProjects,
  getReminders,
  getResourses,
  updateAction,
  updateReminder,
} from '../graphql';
import { Command } from './Command';
import PopupEditing from './PopupEditing';
import getTasks from '../graphql/query/getTasks';
import React from 'react';
import { errorAlert, errorDeleteAlert } from './helpers';
import PopupReminder from '../pubups/PopupReminder';
import { useExpenseItems, useTemplate } from '../hooks';
import { AlertLocal } from '../components';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import getRemindersActions from '../graphql/query/getRemindersActions';
export const getRowId = (row: any) => row._id;

const NumberTypeProvider = (props) => (
  <DataTypeProvider
    formatterComponent={({ value }) => (
      <Typography variant="subtitle2">{Number(value) + 1}</Typography>
    )}
    {...props}
  />
);

const styles = (theme) => ({
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
  },
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  TableComponentBase
);

export default function ReminderCustomer({
  isRTL,
  words,
  resourses,
  employees,
  departments,
  theme,
  id,
  name,
  value,
  isNew,
  width,
  height,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const col = getColumns({ isRTL, words });

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

  const { expenseItems } = useExpenseItems();

  const [type, setType] = useState(2);
  const [rows, setRows] = useState([]);
  const [arows, setArows] = useState([]);

  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [currentViewName, setCurrentViewName] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const currentViewNameChange = (e: any) => {
    setCurrentViewName(e.target.value);
  };
  const currentDateChange = (curDate: any) => {
    setCurrentDate(curDate);
  };

  const endDateChange = (curDate: any) => {
    setEndDate(curDate);
  };

  const refresQuery = {
    refetchQueries: [
      {
        query: getReminders,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getRemindersActions,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
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
    ],
  };

  const [loadReminders, remindersData]: any = useLazyQuery(getReminders);

  const [loadActions, actionsData]: any = useLazyQuery(getRemindersActions);

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadReminders({ variables });
  }, [id, start, end]);

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadActions({ variables });
  }, [id, start, end]);

  useEffect(() => {
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
    }
  }, [remindersData]);

  useEffect(() => {
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
    }
  }, [actionsData]);

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

  return (
    <Box
      style={{
        height: height - 230,
        width: width - 300,
        margin: 10,
      }}
    >
      <Paper
        style={{
          height: height - 240,
          width: width - 320,
        }}
      >
        <Box display="flex">
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
              marginTop: 10,
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
        {rows && type === 1 && (
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <IntegratedSorting />

            <VirtualTable
              height={680}
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              estimatedRowHeight={45}
              tableComponent={TableComponent}
            />

            <DataTypeProvider
              for={['amount']}
              formatterComponent={currencyFormatter}
            ></DataTypeProvider>
            <DataTypeProvider
              for={['time']}
              formatterComponent={actionTimeFormatter}
            ></DataTypeProvider>
            <NumberTypeProvider for={['index']} />
            <TableHeaderRow
              showSortingControls
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />

            {!isNew && (
              <TableEditColumn
                showEditCommand
                showDeleteCommand
                showAddCommand
                commandComponent={Command}
              ></TableEditColumn>
            )}

            <PopupEditing
              theme={theme}
              addAction={addReminder}
              editAction={editReminder}
            >
              <PopupReminder
                value={value}
                name={name}
                servicesproducts={expenseItems}
              ></PopupReminder>
            </PopupEditing>

            <Getter
              name="tableColumns"
              computed={({ tableColumns }) => {
                const result = [
                  {
                    key: 'editCommand',
                    type: TableEditColumn.COLUMN_TYPE,
                    width: isNew ? 20 : 100,
                  },
                  ...tableColumns.filter(
                    (c: any) => c.type !== TableEditColumn.COLUMN_TYPE
                  ),
                ];
                return result;
              }}
            />
          </Grid>
        )}
        {type === 2 && (
          <Grid rows={arows} columns={acolumns} getRowId={getRowId}>
            <SortingState />

            <IntegratedSorting />

            <VirtualTable
              height={680}
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

            <TableHeaderRow
              showSortingControls
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />
          </Grid>
        )}
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Paper>
    </Box>
  );
}
