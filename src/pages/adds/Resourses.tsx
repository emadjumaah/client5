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
import { Command, Loading, PopupEditing } from "../../Shared";
import { getRowId } from "../../common";
import {
  avatarPatternFormatter,
  colorFormatter,
  daysoffFormatter,
} from "../../Shared/colorFormat";
import { AlertLocal, SearchTable } from "../../components";
import { errorAlert, errorDeleteAlert } from "../../Shared/helpers";
import PopupResourses from "../../pubups/PopupResourses";
import PageLayout from "../main/PageLayout";
import useOResoursesTech from "../../hooks/useOResoursesTech";

export default function Resourses({
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
    { name: "avatar", title: words.color },
    {
      name: isRTL ? "departmentNameAr" : "departmentName",
      title: words.department,
    },
    { name: "info", title: words.info },
  ]);

  const {
    employees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refreshemployee,
  } = useOResoursesTech();

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeEmployee({ variables: { _id } });
      if (res?.data?.deleteEmployee?.ok === false) {
        if (res?.data?.deleteEmployee?.error.includes("related")) {
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
      refresh={refreshemployee}
    >
      <Paper>
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid rows={employees} columns={columns} getRowId={getRowId}>
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
          <DataTypeProvider
            for={["color"]}
            formatterComponent={colorFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["daysoff"]}
            formatterComponent={(props: any) =>
              daysoffFormatter({ ...props, isRTL })
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

          <PopupEditing
            theme={theme}
            addAction={addEmployee}
            editAction={editEmployee}
          >
            <PopupResourses resKind={2} resType={2}></PopupResourses>
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