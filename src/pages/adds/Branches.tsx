/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { EditingState, GroupingState } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
} from "@devexpress/dx-react-grid-material-ui";
import { Command, PopupEditing } from "../../Shared";
import PopupBranch from "../../pubups/PopupBranch";
import { useBranches } from "../../hooks";

export const branchCol = [
  { name: "basename", title: "Basename" },
  { name: "name", title: "Name" },
  { name: "nameAr", title: "Name Arabic" },
  { name: "users", title: "Users" },
];
export const branchColExt = [
  { columnName: "basename", width: "10%" },
  { columnName: "name", width: "auto" },
  { columnName: "nameAr", width: "auto" },
  { columnName: "users", width: "10%" },
];

export const getRowId = (row: { _id: any }) => row._id;

export default function Branches({ isRTL, theme, words }: any) {
  const [columns] = useState(branchCol);
  const [tableColumnExtensions]: any = useState(branchColExt);

  const commitChanges = async ({ deleted }) => {
    //
  };

  const { branches, addBranch, editBranch } = useBranches();

  return (
    <Paper>
      <Grid rows={branches} columns={columns} getRowId={getRowId}>
        <GroupingState />
        <EditingState onCommitChanges={commitChanges} />

        <Table columnExtensions={tableColumnExtensions} />
        <VirtualTable
          height={window.innerHeight - 133}
          messages={{
            noData: isRTL ? "لا يوجد بيانات" : "no data",
          }}
          estimatedRowHeight={40}
        />
        <TableHeaderRow />

        <TableEditColumn
          showAddCommand
          commandComponent={Command}
        ></TableEditColumn>

        <PopupEditing addAction={addBranch} editAction={editBranch}>
          <PopupBranch
            isRTL={isRTL}
            theme={theme}
            words={words}
            branches={branches}
          ></PopupBranch>
        </PopupEditing>
      </Grid>
    </Paper>
  );
}
