/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useState } from 'react';
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
  createdAtFormatter,
  currencyFormatter,
  departmentFormatter,
  employeeFormatter,
  eventStatusFormatter,
  fromToFormatter,
} from './colorFormat';

import { Command } from './Command';
import React from 'react';

export const getRowId = (row: any) => row.index;

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

export default function EventsTable({
  rows,
  removeEventFromList,
  isRTL,
  words,
}: any) {
  const col = getColumns({ isRTL, words });

  const [columns] = useState([
    { id: 1, ref: 'title', name: 'title', title: words.title },
    col.startDate,
    col.fromto,
    {
      id: 4,
      ref: 'department',
      name: 'departmentname',
      title: words.department,
    },
    {
      id: 5,
      ref: 'employee',
      name: 'employeename',
      title: words.employee,
    },

    col.status,
    col.amount,
  ]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const index = deleted[0];
      removeEventFromList(index);
    }
  };

  return (
    <Paper
      style={{
        maxHeight: 500,
        overflow: 'auto',
        margin: 10,
        minHeight: 500,
      }}
    >
      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedSorting />
          <VirtualTable
            height={500}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={45}
            tableComponent={TableComponent}
          />
          <DataTypeProvider
            for={['startDate']}
            formatterComponent={createdAtFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['fromto']}
            formatterComponent={fromToFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['status']}
            formatterComponent={eventStatusFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['amount']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['departmentname']}
            formatterComponent={(props: any) =>
              departmentFormatter({ ...props, isRTL })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['employeename']}
            formatterComponent={(props: any) =>
              employeeFormatter({ ...props, isRTL })
            }
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

          <TableEditColumn
            showDeleteCommand={rows && rows.length > 1}
            commandComponent={Command}
          ></TableEditColumn>
          <Getter
            name="tableColumns"
            computed={({ tableColumns }) => {
              const result = [
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: 70,
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
    </Paper>
  );
}
