/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  Grid,
  Table,
  TableEditColumn,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import {
  accountFormatter,
  currencyFormatter,
  taskIdFormatter,
} from './colorFormat';
import { CommandSmall } from './CommandSmall';
import { getColumns } from '../common/columns';
import useTasks from '../hooks/useTasks';
import { useTemplate } from '../hooks';

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

export default function KaidsSingleTable({
  rows,
  removeItem,
  isRTL,
  words,
  accounts,
  editItem,
}: any) {
  const col = getColumns({ isRTL, words });
  const { tasks } = useTasks();

  const { tempoptions } = useTemplate();
  const [columns] = useState(
    tempoptions?.noTsk
      ? [
          { name: 'index', title: words.no },
          { name: 'acc', title: words.account },
          { name: 'amountDebit', title: words.amountDebit },
          { name: 'amountCredit', title: words.amountCredit },
          { name: 'desc', title: words.description },
        ]
      : [
          { name: 'index', title: words.no },
          { name: 'acc', title: words.account },
          { name: 'amountDebit', title: words.amountDebit },
          { name: 'amountCredit', title: words.amountCredit },
          { name: 'desc', title: words.description },
          col.taskId,
          col.resourse,
        ]
  );

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const index = deleted[0];
      removeItem(index);
    }
  };

  const renderEmpty = () => {
    return <Box display="flex"></Box>;
  };
  return (
    <Paper
      style={{
        maxHeight: 265,
        overflow: 'auto',
        margin: 10,
        minHeight: 265,
      }}
    >
      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <EditingState onCommitChanges={commitChanges} />
          <Table
            noDataCellComponent={renderEmpty}
            // columnExtensions={tableColumnExtensions}
            tableComponent={TableComponent}
          />
          <DataTypeProvider
            for={['amount']}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <NumberTypeProvider for={['index']} />
          <DataTypeProvider
            for={['acc']}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={['taskId']}
            formatterComponent={(props: any) =>
              taskIdFormatter({
                ...props,
                tasks,
              })
            }
          ></DataTypeProvider>
          <TableEditColumn
            showDeleteCommand
            // showEditCommand
            commandComponent={CommandSmall}
          ></TableEditColumn>
          <TableHeaderRow
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
    </Paper>
  );
}
