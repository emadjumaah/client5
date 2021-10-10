/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
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
import { Command, PopupEditing } from "../../Shared";
import { getRowId } from "../../common";
import { PopupCustomer } from "../../pubups";
import { AlertLocal, SearchTable } from "../../components";
import { errorAlert, errorDeleteAlert } from "../../Shared/helpers";
import PageLayout from "../main/PageLayout";
import { getColumns } from "../../common/columns";
import {
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from "../../Shared/colorFormat";
import PopupCustomerView from "../../pubups/PopupCustomerView";
import useTasks from "../../hooks/useTasks";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "../../graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useDepartments, useEmployees } from "../../hooks";

export default function Customers(props: any) {
  const { isRTL, words, menuitem, isEditor, theme, company, servicesproducts } =
    props;
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);

  const { tasks } = useTasks();
  const { departments } = useDepartments();
  const { employees } = useEmployees();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    { name: isRTL ? "nameAr" : "name", title: words.name },
    { name: "phone", title: words.phoneNumber },
    { name: "email", title: words.email },
    { name: "address", title: words.address },
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

  const [loadTasks, tasksData]: any = useLazyQuery(getCustomers, {
    fetchPolicy: "cache-and-network",
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getCustomers,
        variables: { isRTL },
      },
    ],
  };

  useEffect(() => {
    if (openItem) {
      const tsks = tasksData?.data?.["getCustomers"]?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [tasksData]);

  useEffect(() => {
    loadTasks({ isRTL });
  }, []);

  const [addCustomer] = useMutation(createCustomer, refresQuery);
  const [editCustomer] = useMutation(updateCustomer, refresQuery);
  const [removeCustomer] = useMutation(deleteCustomer, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeCustomer({ variables: { _id } });
      if (res?.data?.deleteCustomer?.ok === false) {
        if (res?.data?.deleteCustomer?.error.includes("related")) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (tasksData?.data?.getCustomers?.data) {
      const { data } = tasksData.data.getCustomers;
      setRows(data);
    }
  }, [tasksData]);

  const refresh = () => {
    tasksData?.refetch();
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      isEditor={isEditor}
      theme={theme}
      refresh={refresh}
    >
      <Paper>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
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
            defaultHiddenColumnNames={["email", "address"]}
          />
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
            addAction={addCustomer}
            editAction={editCustomer}
          >
            <PopupCustomer></PopupCustomer>
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
        <PopupCustomerView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addCustomer}
          editAction={editCustomer}
          theme={theme}
          isEditor={isEditor}
          departments={departments}
          company={company}
          employees={employees}
          servicesproducts={servicesproducts}
          customers={rows}
          tasks={tasks}
        ></PopupCustomerView>
      </Paper>
    </PageLayout>
  );
}
