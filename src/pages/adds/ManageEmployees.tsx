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
import { Command, Loading, PopupEditing } from "../../Shared";
import { getRowId } from "../../common";
import { PopupEmployee } from "../../pubups";
import {
  avatarPatternFormatter,
  currencyFormatterEmpty,
  daysoffFormatter,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from "../../Shared/colorFormat";
import { AlertLocal, SearchTable } from "../../components";
import { errorAlert, errorDeleteAlert } from "../../Shared/helpers";
import useHResourses from "../../hooks/useHResourses";
import PageLayout from "../main/PageLayout";
import { getColumns } from "../../common/columns";
import PopupEmployeeView from "../../pubups/PopupEmployeeView";
import useTasks from "../../hooks/useTasks";
import { useCustomers, useDepartments } from "../../hooks";

export default function ManageEmployees({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
  servicesproducts,
  company,
}: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

  const { tasks } = useTasks();
  const { departments } = useDepartments();
  const { customers } = useCustomers();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [columns] = useState([
    { name: isRTL ? "nameAr" : "name", title: words.name },
    { name: "avatar", title: words.color },
    { name: "phone", title: words.phoneNumber },
    { name: "email", title: words.email },
    {
      name: isRTL ? "departmentNameAr" : "departmentName",
      title: words.department,
    },
    { name: "info", title: words.info },
    { name: "daysoff", title: isRTL ? "يوم العطلة" : "Day Off" },
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
    employees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refreshemployee,
  } = useHResourses();

  useEffect(() => {
    if (openItem) {
      if (employees && employees.length > 0) {
        const opened = employees.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [employees]);

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
        <Grid
          rows={employees.filter((em: any) => em.resType === 1)}
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
            defaultHiddenColumnNames={[
              "email",
              "info",
              "phone",
              "daysoff",
              "avatar",
            ]}
          />

          <DataTypeProvider
            for={["daysoff"]}
            formatterComponent={(props: any) =>
              daysoffFormatter({ ...props, isRTL })
            }
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
            addAction={addEmployee}
            editAction={editEmployee}
          >
            <PopupEmployee resKind={1} resType={1}></PopupEmployee>
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
        <PopupEmployeeView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addEmployee}
          editAction={editEmployee}
          theme={theme}
          isEditor={isEditor}
          departments={departments}
          company={company}
          employees={employees}
          servicesproducts={servicesproducts}
          customers={customers}
          tasks={tasks}
        ></PopupEmployeeView>
      </Paper>
    </PageLayout>
  );
}
