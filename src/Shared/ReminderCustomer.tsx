/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  ColumnChooser,
  DragDropProvider,
  Grid,
  PagingPanel,
  SearchPanel,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableEditColumn,
  TableHeaderRow,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import {
  DataTypeProvider,
  EditingState,
  IntegratedFiltering,
  IntegratedPaging,
  IntegratedSorting,
  PagingState,
  SearchState,
  SortingState,
} from '@devexpress/dx-react-grid';
import { getColumns } from '../common/columns';
import { actionTimeFormatter, sentFormatter } from './colorFormat';
import { useLazyQuery, useMutation } from '@apollo/client';

import getRemindersActions from '../graphql/query/getRemindersActions';
import useDepartments from '../hooks/useDepartments';
import useEmployees from '../hooks/useEmployees';
import useResourses from '../hooks/useResourses';
import { createReminder, deleteAction, updateAction } from '../graphql';
import { errorAlert, errorDeleteAlert } from './helpers';
import useTasks from '../hooks/useTasks';
import { Command } from './Command';
import { AlertLocal, SearchTable } from '../components';
import PopupEditing from './PopupEditing';
import PopupReminder from '../pubups/PopupReminder';
import RefetchBox from './RefetchBox';
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
  id,
  width,
  height,
  start,
  end,
  tempoptions,
  theme,
  name,
  value,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const col = getColumns({ isRTL, words });
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          col.sent,
          col.time,
          { name: 'title', title: words?.description },
          col.employee,
          col.department,
        ]
      : [
          col.sent,
          col.time,
          { name: 'title', title: words?.description },
          col.resourse,
          col.employee,
          col.department,
          col.contract,
        ]
  );

  const [tableColumnExtensions]: any = useState([
    { columnName: col.time.name, width: 150 },
    { columnName: col.title.name, width: 250 },
    { columnName: col.resourse.name, width: 200 },
    { columnName: col.employee.name, width: 200 },
    { columnName: col.department.name, width: 200 },
    { columnName: col.contract.name, width: 200 },
    { columnName: col.sent.name, width: 120 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 15, 20, 50, 0]);

  const [rows, setRows] = useState([]);

  const { employees } = useEmployees();
  const { resourses } = useResourses();
  const { departments } = useDepartments();
  const { tasks } = useTasks();

  const [loadReminders, remindersData]: any = useLazyQuery(getRemindersActions);

  const refresQuery = {
    refetchQueries: [
      {
        query: getRemindersActions,
        variables: {
          [name]: id,
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
    ],
  };

  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadReminders({
      variables,
    });
  }, [id, start, end]);

  const [addReminder] = useMutation(createReminder, refresQuery);
  const [editRAction] = useMutation(updateAction, refresQuery);
  const [removeRAction] = useMutation(deleteAction, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeRAction({ variables: { _id } });
      if (res?.data?.deleteAction?.ok === false) {
        if (res?.data?.deleteAction?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (remindersData?.data?.getRemindersActions?.data) {
      const { data } = remindersData.data.getRemindersActions;
      const rdata = data.map((da: any) => {
        let resourseNameAr: any;
        let resourseName: any;
        let departmentNameAr: any;
        let departmentName: any;
        let employeeNameAr: any;
        let employeeName: any;
        let contractNameAr: any;
        let contractName: any;
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
        if (da?.contractId) {
          const res = tasks.filter((re: any) => re._id === da.contractId)?.[0];
          contractNameAr = res?.nameAr;
          contractName = res?.name;
        }
        return {
          ...da,
          resourseName,
          resourseNameAr,
          departmentNameAr,
          departmentName,
          employeeNameAr,
          employeeName,
          contractNameAr,
          contractName,
          time: da?.sendtime,
        };
      });
      setRows(rdata);
    }
  }, [remindersData]);

  const refresh = () => remindersData?.refetch();
  const loading = remindersData.loading;
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          left: isRTL ? 220 : undefined,
          right: isRTL ? undefined : 220,
          zIndex: 111,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 55,
        }}
      >
        <RefetchBox
          isRTL={isRTL}
          theme={theme}
          refresh={refresh}
          loading={loading}
        ></RefetchBox>
      </Box>
      <Paper
        elevation={0}
        style={{
          overflow: 'auto',
          width: width - 320,
          height: height - 290,
        }}
      >
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={commitChanges} />
          <SearchState />
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
          <IntegratedSorting />
          <IntegratedFiltering />
          <IntegratedPaging />
          <DragDropProvider />
          <Table
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            tableComponent={TableComponent}
            rowComponent={(props: any) => (
              <Table.Row {...props} style={{ height: 50 }}></Table.Row>
            )}
            columnExtensions={tableColumnExtensions}
          />

          <TableColumnReordering
            defaultOrder={[
              col.sent.name,
              col.time.name,
              col.title.name,
              col.resourse.name,
              col.employee.name,
              col.department.name,
              col.contract.name,
            ]}
          />
          <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />

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
          <TableColumnVisibility
            columnExtensions={tableColumnVisibilityColumnExtensions}
            defaultHiddenColumnNames={[col.amount.name]}
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
          <TableEditColumn
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>

          <Toolbar />
          <ColumnChooser />
          <PagingPanel pageSizes={pageSizes} />

          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
          <PopupEditing
            theme={theme}
            addAction={addReminder}
            editAction={() => null}
          >
            <PopupReminder
              value={value}
              name={name}
              tasks={tasks}
            ></PopupReminder>
          </PopupEditing>
        </Grid>
      </Paper>
      {alrt.show && (
        <AlertLocal
          isRTL={isRTL}
          type={alrt?.type}
          msg={alrt?.msg}
          top
        ></AlertLocal>
      )}
    </Box>
  );
}
