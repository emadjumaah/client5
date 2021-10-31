/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupInvoice } from '../../pubups';
import {
  createInvoice,
  deleteInvoice,
  getCustomers,
  getDepartments,
  getEmployees,
  getInvoices,
  getLandingChartData,
  getLastNos,
  getProjects,
  getResourses,
  updateInvoice,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  amountFormatter,
  currencyFormatter,
  taskIdFormatter,
  timeFormatter,
} from '../../Shared/colorFormat';
import PageLayout from '../main/PageLayout';
import { SearchTable } from '../../components';
import { SalesContext } from '../../contexts';
import DateNavigatorReports from '../../components/filters/DateNavigatorReports';
import { getColumns } from '../../common/columns';
import useTasks from '../../hooks/useTasks';
import { TableComponent } from '../reports/SalesReport';
import { colors } from '@material-ui/core';
import getTasks from '../../graphql/query/getTasks';
import useResoursesUp from '../../hooks/useResoursesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import { useServices } from '../../hooks';

export default function Invoices({
  isRTL,
  words,
  menuitem,
  isEditor,
  theme,
  company,
}) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { name: 'time', title: words.time },
    { name: 'docNo', title: words.no },
    col.eventNo,
    col.taskId,
    col.customer,
    { name: 'customerPhone', title: words.phoneNumber },
    { name: 'total', title: words.total },
    { name: 'discount', title: words.discount },
    { name: 'amount', title: words.amount },
  ]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);

  const { tasks } = useTasks();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

  const {
    state: { currentDate, currentViewName, endDate, sort },
    dispatch,
  } = useContext(SalesContext);

  const currentViewNameChange = (e: any) => {
    dispatch({ type: 'setCurrentViewName', payload: e.target.value });
  };
  const currentDateChange = (curDate: any) => {
    dispatch({ type: 'setCurrentDate', payload: curDate });
  };

  const endDateChange = (curDate: any) => {
    dispatch({ type: 'setEndDate', payload: curDate });
  };

  const [loadInvoices, opData]: any = useLazyQuery(getInvoices, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          start: start ? start.setHours(0, 0, 0, 0) : undefined,
          end: end ? end.setHours(23, 59, 59, 999) : undefined,
        },
      },
      {
        query: getLandingChartData,
      },
      {
        query: getLastNos,
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

  useEffect(() => {
    const variables = {
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };
    loadInvoices({
      variables,
    });
  }, [start, end]);

  const [addInvoice] = useMutation(createInvoice, refresQuery);
  const [editInvoice] = useMutation(updateInvoice, refresQuery);
  const [removeInvoice] = useMutation(deleteInvoice, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      removeInvoice({ variables: { _id } });
      setRows(rows.filter((row: any) => row._id !== _id));
    }
  };

  useEffect(() => {
    if (opData?.loading) {
      setLoading(true);
    }
    if (opData?.data?.getInvoices?.data) {
      const { data } = opData.data.getInvoices;
      setRows(data);
      setLoading(false);
    }
  }, [opData]);

  const refresh = () => {
    opData?.refetch();
  };

  const setSortDispatch = (value: any) => {
    dispatch({ type: 'setSort', payload: value });
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refresh}
      bgcolor={colors.green[500]}
    >
      <Paper>
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
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState
            defaultSorting={sort}
            onSortingChange={(srt: any) => setSortDispatch(srt)}
          />
          <EditingState onCommitChanges={commitChanges} />
          <SearchState />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={window.innerHeight - 181}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
            tableComponent={TableComponent}
          />
          <TableHeaderRow showSortingControls />

          <DataTypeProvider
            for={['time']}
            formatterComponent={timeFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount']}
            formatterComponent={amountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['total', 'discount']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormatter({ ...props, tasks })
            }
          ></DataTypeProvider>

          {isEditor && (
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
          )}

          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
          <PopupEditing addAction={addInvoice} editAction={editInvoice}>
            <PopupInvoice
              resourses={resourses}
              employees={employees}
              departments={departments}
              company={company}
              servicesproducts={services}
              tasks={tasks}
            ></PopupInvoice>
          </PopupEditing>
        </Grid>
        {loading && <Loading isRTL={isRTL} />}
      </Paper>
    </PageLayout>
  );
}
