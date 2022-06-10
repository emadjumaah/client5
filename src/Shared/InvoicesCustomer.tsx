/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '.';
import { getRowId, updateDocNumbers } from '../common';
import { PopupInvoice } from '../pubups';
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
} from '../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  amountFormatter,
  currencyFormatter,
  taskIdFormatter,
  timeFormatter,
} from './colorFormat';

import { getColumns } from '../common/columns';
import useTasks from '../hooks/useTasks';
import { TableComponent } from '../pages/reports/SalesReport';
import getTasks from '../graphql/query/getTasks';
import { Box } from '@material-ui/core';
import DateNavigatorReports from '../components/filters/DateNavigatorReports';
import { useTemplate } from '../hooks';

export default function InvoicesCustomer({
  isRTL,
  words,
  employees,
  resourses,
  departments,
  company,
  servicesproducts,
  name,
  id,
  value,
  theme,
}) {
  const col = getColumns({ isRTL, words });

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.eventNo,
          {
            name: isRTL ? 'customerNameAr' : 'customerName',
            title: words.customer,
          },
          { name: 'customerPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
      : [
          { name: 'time', title: words.time },
          { name: 'docNo', title: words.no },
          col.eventNo,
          col.taskId,
          {
            name: isRTL ? 'customerNameAr' : 'customerName',
            title: words.customer,
          },
          { name: 'customerPhone', title: words.phoneNumber },
          { name: 'total', title: words.total },
          { name: 'discount', title: words.discount },
          { name: 'amount', title: words.amount },
        ]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { tasks } = useTasks();

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

  const [loadInvoices, opData]: any = useLazyQuery(getInvoices, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getInvoices,
        variables: {
          [name]: id,
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
      [name]: id,
      start: start ? start.setHours(0, 0, 0, 0) : undefined,
      end: end ? end.setHours(23, 59, 59, 999) : undefined,
    };

    loadInvoices({
      variables,
    });
  }, [id, start, end]);

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
      const rdata = updateDocNumbers(data);
      setRows(rdata);
      setLoading(false);
    }
  }, [opData]);

  return (
    <Paper
      style={{
        maxHeight: 600,
        overflow: 'auto',
        margin: 10,
        minHeight: 600,
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
      </Box>
      <Grid rows={rows} columns={columns} getRowId={getRowId}>
        <SortingState />
        <EditingState onCommitChanges={commitChanges} />

        <IntegratedSorting />
        <IntegratedFiltering />

        <VirtualTable
          height={550}
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

        <TableEditColumn
          showEditCommand
          showDeleteCommand
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>
        <PopupEditing addAction={addInvoice} editAction={editInvoice}>
          <PopupInvoice
            value={value}
            name={name}
            employees={employees}
            resourses={resourses}
            departments={departments}
            company={company}
            servicesproducts={servicesproducts}
            tasks={tasks}
          ></PopupInvoice>
        </PopupEditing>
      </Grid>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}
