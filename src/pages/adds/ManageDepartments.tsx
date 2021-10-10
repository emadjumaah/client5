/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
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
  TableColumnVisibility,
  ColumnChooser,
} from "@devexpress/dx-react-grid-material-ui";
import { Command, errorAlert, Loading, PopupEditing } from "../../Shared";
import { useCustomers, useDepartments, useEmployees } from "../../hooks";
import { getRowId } from "../../common";
import { PopupDeprtment } from "../../pubups";
import {
  avatarPatternFormatter,
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from "../../Shared/colorFormat";
import { AlertLocal, SearchTable } from "../../components";
import { errorDeleteAlert } from "../../Shared/helpers";
import PageLayout from "../main/PageLayout";
import { getColumns } from "../../common/columns";
import useTasks from "../../hooks/useTasks";
import PopupDepartmentView from "../../pubups/PopupDepartmentView";

export default function ManageDepartments({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
  company,
  servicesproducts,
}: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

  const { tasks } = useTasks();
  const { employees } = useEmployees();
  const { customers } = useCustomers();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [columns] = useState([
    { name: isRTL ? "nameAr" : "name", title: words.name },
    { name: "avatar", title: words.color },
    { name: "desc", title: words.description },
    { name: "amount", title: isRTL ? "الاجمالي" : "Total" },
    col.progress,
    col.totalinvoiced,
    col.totalpaid,
    {
      id: 40,
      ref: "due",
      name: "due",
      title: isRTL ? "المتبقي" : "Due Payment",
    },
    col.toatlExpenses,
    {
      id: 38,
      ref: "income",
      name: "income",
      title: isRTL ? "صافي الايراد" : "Total Income",
    },
  ]);

  const {
    departments,
    addDepartment,
    editDepartment,
    removeDepartment,
    refreshdepartment,
  } = useDepartments();

  useEffect(() => {
    if (openItem) {
      if (departments && departments.length > 0) {
        const opened = departments.filter(
          (ts: any) => ts._id === item._id
        )?.[0];
        setItem(opened);
      }
    }
  }, [departments]);

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

        <Grid
          rows={departments.filter((em: any) => em.depType === 1)}
          columns={columns}
          getRowId={getRowId}
        >
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
          <TableColumnVisibility
            defaultHiddenColumnNames={["avatar", "depType", "desc"]}
          />
          <DataTypeProvider
            for={["avatar"]}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["nameAr", "name"]}
            formatterComponent={(props: any) =>
              nameLinkFormat({ ...props, setItem, setOpenItem })
            }
          ></DataTypeProvider>
          <DataTypeProvider
            for={["amount", "toatlExpenses", "totalpaid", "totalinvoiced"]}
            formatterComponent={currencyFormatterEmpty}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["due"]}
            formatterComponent={dueAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["avatar"]}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["income"]}
            formatterComponent={incomeAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={["progress"]}
            formatterComponent={progressFormatter}
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
          <ColumnChooser />

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
            <PopupDeprtment depType={1}></PopupDeprtment>
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
        <PopupDepartmentView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addDepartment}
          editAction={editDepartment}
          theme={theme}
          isEditor={isEditor}
          departments={departments}
          company={company}
          employees={employees}
          servicesproducts={servicesproducts}
          customers={customers}
          tasks={tasks}
        ></PopupDepartmentView>
      </Paper>
    </PageLayout>
  );
}
