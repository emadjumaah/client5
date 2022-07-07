/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import {
  DataTypeProvider,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import { getColumns } from '../common/columns';
import { actionTimeFormatter, sentShowFormatter } from './colorFormat';
import { useLazyQuery } from '@apollo/client';

import getRemindersActions from '../graphql/query/getRemindersActions';
import useDepartmentsUp from '../hooks/useDepartmentsUp';
import useEmployeesUp from '../hooks/useEmployeesUp';
import useResoursesUp from '../hooks/useResoursesUp';
export const getRowId = (row: any) => row._id;

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
  theme,
  id,
  name,
  width,
  height,
  start,
  end,
  tempoptions,
}: any) {
  const col = getColumns({ isRTL, words });
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

  const [arows, setArows] = useState([]);

  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { departments } = useDepartmentsUp();

  const [loadActions, actionsData]: any = useLazyQuery(getRemindersActions, {
    nextFetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadActions({ variables });
  }, [id, start, end]);
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

  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Paper
        style={{
          height: height - 290,
          width: width - 320,
        }}
      >
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
            formatterComponent={sentShowFormatter}
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
      </Paper>
    </Box>
  );
}
