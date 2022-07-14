/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react';
import {
  Grid,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import {
  DataTypeProvider,
  EditingState,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';
import { getColumns } from '../common/columns';
import { actionTimeFormatter, sentFormatter } from './colorFormat';
import { useLazyQuery, useMutation } from '@apollo/client';

import getRemindersActions from '../graphql/query/getRemindersActions';

import { updateAction } from '../graphql';

import Loading from './Loading';
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

export default function ReminderBox({
  isRTL,
  words,
  id,
  name,
  start,
  end,
  theme,
  height = 250,
}: any) {
  const [loading, setLoading] = useState(false);

  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    col.sent,
    col.time,
    { name: 'title', title: words?.description },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: col.sent.name, width: 120 },
    { columnName: col.time.name, width: 150 },
    { columnName: col.title.name, width: 250 },
  ]);

  const [tableColumnVisibilityColumnExtensions] = useState([
    { columnName: 'time', togglingEnabled: false },
  ]);
  const [rows, setRows] = useState([]);

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

  const [editRAction] = useMutation(updateAction, refresQuery);

  useEffect(() => {
    if (remindersData?.loading) {
      setLoading(true);
    }
    if (remindersData?.data?.getRemindersActions?.data) {
      const { data } = remindersData.data.getRemindersActions;
      const rdata = data.map((da: any) => {
        return {
          ...da,
          time: da?.sendtime,
        };
      });
      setRows(rdata);
      setLoading(false);
    }
  }, [remindersData]);

  return (
    <Box
      style={{
        height,
        width: '100%',
      }}
    >
      <Paper
        elevation={0}
        style={{
          overflow: 'auto',
          height,
          width: '100%',
        }}
      >
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <SortingState />
          <EditingState onCommitChanges={() => null} />
          <IntegratedSorting />
          <Table
            messages={{
              noData: isRTL ? 'لا يوجد تذكيرات' : 'no data',
            }}
            tableComponent={TableComponent}
            rowComponent={(props: any) => (
              <Table.Row {...props} style={{ height: 50 }}></Table.Row>
            )}
            columnExtensions={tableColumnExtensions}
          />

          <TableColumnReordering
            defaultOrder={[col.sent.name, col.time.name, col.title.name]}
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
            defaultHiddenColumnNames={[]}
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
        </Grid>
      </Paper>
      {loading && <Loading isRTL={isRTL} />}
    </Box>
  );
}
