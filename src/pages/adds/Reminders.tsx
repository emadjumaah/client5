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
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  Toolbar,
  SearchPanel,
  TableEditColumn,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  ColumnChooser,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { actionTimeFormatter, sentFormatter } from '../../Shared/colorFormat';

import { AlertLocal, SearchTable } from '../../components';
import { getColumns } from '../../common/columns';

import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import PageLayout from '../main/PageLayout';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupReminder from '../../pubups/PopupReminder';
import { useLazyQuery, useMutation } from '@apollo/client';
import { createReminder, deleteAction, updateAction } from '../../graphql';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import ReminderContext from '../../contexts/reminder';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { useTemplate } from '../../hooks';
import getRemindersActions from '../../graphql/query/getRemindersActions';
import { TableComponent } from '../../Shared/TableComponent';
import useTasks from '../../hooks/useTasks';

export default function Reminders(props: any) {
  const { isRTL, words, menuitem, theme } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const { tasks } = useTasks();
  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
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
    { columnName: col.sent.name, width: 120 },
    { columnName: col.time.name, width: 150 },
    { columnName: col.title.name, width: 250 },
    { columnName: col.resourse.name, width: 200 },
    { columnName: col.employee.name, width: 200 },
    { columnName: col.department.name, width: 200 },
    { columnName: col.contract.name, width: 200 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const [pageSizes] = useState([5, 10, 15, 20, 50, 0]);

  const { width, height } = useWindowDimensions();
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();

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

  const [loadReminders, remindersData]: any = useLazyQuery(getRemindersActions);

  const refresQuery = {
    refetchQueries: [
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
    if (remindersData?.loading) {
      setLoading(true);
    }
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
      setLoading(false);
    }
  }, [remindersData]);

  const refresh = () => {
    remindersData?.refetch();
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
        </Box>
        <Paper
          elevation={5}
          style={{
            marginLeft: 40,
            marginRight: 40,
            marginTop: 60,
            overflow: 'auto',
            width: width - 330,
            borderRadius: 10,
          }}
        >
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={15} />
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
                <Table.Row {...props} style={{ height: 40 }}></Table.Row>
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
              <PopupReminder tasks={tasks}></PopupReminder>
            </PopupEditing>
          </Grid>
        </Paper>

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
