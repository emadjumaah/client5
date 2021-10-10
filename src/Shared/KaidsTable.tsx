/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import {
  Grid,
  Table,
  TableEditColumn,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";
import { Box, fade, Paper, Typography, withStyles } from "@material-ui/core";
import { DataTypeProvider, EditingState } from "@devexpress/dx-react-grid";
import { accountFormatter, currencyFormatter } from "./colorFormat";
import { CommandSmall } from "./CommandSmall";

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
    "& tbody tr:nth-of-type(odd)": {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
  },
});

const TableComponentBase = ({ classes, ...restProps }) => (
  <Table.Table {...restProps} className={classes.tableStriped} />
);

export const TableComponent = withStyles(styles, { name: "TableComponent" })(
  TableComponentBase
);

export default function KaidsTable({
  rows,
  removeItem,
  isRTL,
  words,
  accounts,
}: any) {
  const [columns] = useState([
    { name: "index", title: words.no },
    { name: "debitAcc", title: words.to },
    { name: "creditAcc", title: words.from },
    { name: "desc", title: words.description },
    { name: "amount", title: words.amount },
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: "index", width: "10%", align: "left" },
    { columnName: "debitAcc", width: "20%", align: "left" },
    { columnName: "creditAcc", width: "20%", align: "left" },
    { columnName: "desc", width: "auto" },
    { columnName: "amount", width: "15%", align: "right" },
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

  return (
    <Paper
      style={{
        maxHeight: 265,
        overflow: "auto",
        margin: 10,
        minHeight: 265,
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
          <DataTypeProvider
            for={["amount"]}
            formatterComponent={currencyFormatter}
          ></DataTypeProvider>
          <NumberTypeProvider for={["index"]} />
          <DataTypeProvider
            for={["debitAcc", "creditAcc"]}
            formatterComponent={(props) =>
              accountFormatter(props, accounts, isRTL)
            }
          ></DataTypeProvider>
          <TableEditColumn
            showDeleteCommand
            // showEditCommand
            commandComponent={CommandSmall}
          ></TableEditColumn>
          <TableHeaderRow />
        </Grid>
      )}
    </Paper>
  );
}
