/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import { Box, fade, Paper, Typography, withStyles } from '@material-ui/core';
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import { CommandSmall } from './CommandSmall';
import { Getter } from '@devexpress/dx-react-core';
import PopupEditing from './PopupEditing';
import PopupItem from '../pubups/PopupItem';
// import { Command, PopupEditing } from "../../Shared";
export const getRowId = (row: any) => row.index;

const CurrencyFormatter = ({ value }) => (
  <Box
    display="flex"
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    }}
  >
    <Typography variant="subtitle2">
      {value ? value.toLocaleString('en-QA') : ''}
    </Typography>
  </Box>
);

const CurrencyTypeProvider = (props) => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);
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

export default function ItemsTable({
  rows,
  removeItem,
  editItem,
  isRTL,
  words,
  user,
  height = 265,
  products,
}: any) {
  const [columns] = useState([
    { name: 'index', title: words.no },
    { name: isRTL ? 'nameAr' : 'name', title: words.item },
    { name: 'desc', title: words.description },
    { name: 'itemqty', title: words.qty },
    { name: 'itemprice', title: words.theprice },
    { name: 'itemtotal', title: words.total },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'index', width: '10%', align: 'left' },
    { columnName: 'name', width: 'auto' },
    { columnName: 'itemqty', width: '10%', align: 'right' },
    { columnName: 'itemprice', width: '15%', align: 'right' },
    { columnName: 'itemtotal', width: '15%', align: 'right' },
  ]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const index = deleted[0];
      removeItem(index);
    }
  };

  const renderEmpty = () => {
    return <Box display="flex"></Box>;
  };

  const addAction = () => {
    //
  };

  return (
    <Paper
      style={{
        maxHeight: height,
        overflow: 'auto',
        margin: 10,
        minHeight: height,
      }}
    >
      {rows && (
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <EditingState onCommitChanges={commitChanges} />

          <Table
            noDataCellComponent={renderEmpty}
            columnExtensions={tableColumnExtensions}
            tableComponent={TableComponent}
          />
          <CurrencyTypeProvider for={['itemtotal', 'itemqty', 'itemprice']} />
          <NumberTypeProvider for={['index']} />
          <TableHeaderRow />
          <TableEditColumn
            showDeleteCommand
            showEditCommand
            commandComponent={CommandSmall}
          ></TableEditColumn>
          <PopupEditing addAction={addAction} editAction={editItem}>
            <PopupItem
              products={products}
              user={user}
              isRTL={isRTL}
              words={words}
            ></PopupItem>
          </PopupEditing>
          <Getter
            name="tableColumns"
            computed={({ tableColumns }) => {
              const result = [
                {
                  key: 'editCommand',
                  type: TableEditColumn.COLUMN_TYPE,
                  width: 120,
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
