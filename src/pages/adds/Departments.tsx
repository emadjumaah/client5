/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
} from "@devexpress/dx-react-grid-material-ui";
import { Command, errorAlert, Loading, PopupEditing } from "../../Shared";
import { getRowId } from "../../common";
import { PopupDeprtment } from "../../pubups";
import { avatarPatternFormatter } from "../../Shared/colorFormat";
import { AlertLocal, SearchTable } from "../../components";
import { errorDeleteAlert } from "../../Shared/helpers";
import PageLayout from "../main/PageLayout";
import useDepartmentsTech from "../../hooks/useDepartmentsTech";

export default function Departments({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
}: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });

  const [columns] = useState([
    { name: isRTL ? "nameAr" : "name", title: words.name },
    { name: isRTL ? "name" : "nameAr", title: words.name },
    { name: "desc", title: words.description },
    { name: "avatar", title: words.color },
    { id: 11, ref: "status", name: "status", title: " " },
  ]);

  const {
    departments,
    addDepartment,
    editDepartment,
    removeDepartment,
    refreshdepartment,
  } = useDepartmentsTech();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeDepartment({ variables: { _id } });
      if (res?.data?.deleteDepartment?.ok === false) {
        if (res?.data?.deleteDepartment?.error.includes("related")) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
      setLoading(false);
    }
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refreshdepartment}
    >
      <Paper>
        {loading && <Loading isRTL={isRTL}></Loading>}

        <Grid rows={departments} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />
          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={window.innerHeight - 133}
            messages={{
              noData: isRTL ? "لا يوجد بيانات" : "no data",
            }}
            estimatedRowHeight={40}
          />

          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={["avatar"]}
            formatterComponent={avatarPatternFormatter}
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

          <PopupEditing
            theme={theme}
            addAction={addDepartment}
            editAction={editDepartment}
          >
            <PopupDeprtment depType={2}></PopupDeprtment>
          </PopupEditing>
        </Grid>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
      </Paper>
    </PageLayout>
  );
}
