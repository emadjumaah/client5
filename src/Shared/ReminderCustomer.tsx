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
import { fade, Paper, Typography, withStyles } from '@material-ui/core';
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
  taskIdFormat,
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
  updateReminder,
} from '../graphql';
import { Command } from './Command';
import PopupEditing from './PopupEditing';
import getTasks from '../graphql/query/getTasks';
import LoadingInline from './LoadingInline';
import useTasks from '../hooks/useTasks';
import React from 'react';
import { errorAlert, errorDeleteAlert } from './helpers';
import PopupReminder from '../pubups/PopupReminder';
import { useExpenseItems } from '../hooks';
import { AlertLocal } from '../components';
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
  isNew,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [loading, setLoading] = useState(true);
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    col.time,
    col.title,
    col.resourse,
    col.employee,
    col.department,
    col.taskId,
    col.amount,
  ]);
  const { tasks } = useTasks();
  const { expenseItems } = useExpenseItems();

  const [rows, setRows] = useState([]);

  const refresQuery = {
    refetchQueries: [
      {
        query: getReminders,
        variables: { [name]: id },
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

  const [loadReminders, remindersData]: any = useLazyQuery(getReminders, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    const variables = { [name]: id };
    loadReminders({ variables });
  }, [id]);

  useEffect(() => {
    if (remindersData?.loading) {
      setLoading(true);
    }
    if (remindersData?.data?.getReminders?.data) {
      const { data } = remindersData.data.getReminders;
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
          time: new Date(da.runtime),
        };
      });
      setRows(rdata);
      setLoading(false);
    }
  }, [remindersData]);

  const [addReminder] = useMutation(createReminder, refresQuery);
  const [editReminder] = useMutation(updateReminder, refresQuery);
  const [removeReminder] = useMutation(deleteReminder, refresQuery);

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
    <Paper
      style={{
        maxHeight: 600,
        overflow: 'auto',
        margin: 10,
        minHeight: 600,
      }}
    >
      {loading && <LoadingInline></LoadingInline>}

      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedSorting />

          <VirtualTable
            height={600}
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
          <DataTypeProvider
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormat({
                ...props,
                tasks,
              })
            }
          ></DataTypeProvider>
          <NumberTypeProvider for={['index']} />
          <TableHeaderRow showSortingControls />

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
            <PopupReminder servicesproducts={expenseItems}></PopupReminder>
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
      {alrt.show && (
        <AlertLocal
          isRTL={isRTL}
          type={alrt?.type}
          msg={alrt?.msg}
          top
        ></AlertLocal>
      )}
    </Paper>
  );
}
