/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  SearchState,
  IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  VirtualTable,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId, roles } from '../../common';
import { PopupCustomer } from '../../pubups';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import {
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from '../../Shared/colorFormat';
import PopupCustomerView from '../../pubups/PopupCustomerView';
import useTasks from '../../hooks/useTasks';
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { useServices } from '../../hooks';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import PopupCustomerImport from '../../pubups/PopupCustomerImport';
import ImportBtn from '../../common/ImportBtn';
import createMultiCustomers from '../../graphql/mutation/createMultiCustomers';

export default function Customers(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openImport, setOpenImport] = useState(false);
  const [openItem, setOpenItem] = useState(false);
  const { height } = useWindowDimensions();
  const { tasks } = useTasks();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const col = getColumns({ isRTL, words });
  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    { name: 'address', title: words.address },
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
    col.progress,
    col.totalinvoiced,
    col.totalpaid,
    {
      id: 40,
      ref: 'due',
      name: 'due',
      title: isRTL ? 'المتبقي' : 'Due Payment',
    },
    col.toatlExpenses,
    {
      id: 38,
      ref: 'income',
      name: 'income',
      title: isRTL ? 'صافي الايراد' : 'Total Income',
    },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    { name: 'address', title: words.address },
  ]);

  const [loadCusts, custssData]: any = useLazyQuery(getCustomers, {
    fetchPolicy: 'cache-and-network',
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
      const tsks = custssData?.data?.['getCustomers']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [custssData]);

  useEffect(() => {
    loadCusts({ isRTL });
  }, []);

  const [addCustomer] = useMutation(createCustomer, refresQuery);
  const [addMultiCustomers] = useMutation(createMultiCustomers, refresQuery);
  const [editCustomer] = useMutation(updateCustomer, refresQuery);
  const [removeCustomer] = useMutation(deleteCustomer, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeCustomer({ variables: { _id } });
      if (res?.data?.deleteCustomer?.ok === false) {
        if (res?.data?.deleteCustomer?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (custssData?.data?.getCustomers?.data) {
      const { data } = custssData.data.getCustomers;
      setRows(data);
    }
  }, [custssData]);

  const refresh = () => {
    custssData?.refetch();
  };
  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refresh}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <ImportBtn
          open={() => setOpenImport(true)}
          isRTL={isRTL}
          theme={theme}
        ></ImportBtn>
        <Grid
          rows={rows}
          columns={roles.isEditor() ? columns : columnsViewer}
          getRowId={getRowId}
        >
          <SortingState />
          <SearchState />
          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={height - 100}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
            tableComponent={TableComponent}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnVisibility
            defaultHiddenColumnNames={[
              'amount',
              'progress',
              'totalinvoiced',
              'totalpaid',
              'due',
              'toatlExpenses',
              'income',
            ]}
          />
          {roles.isEditor() && (
            <DataTypeProvider
              for={['nameAr', 'name']}
              formatterComponent={(props: any) =>
                nameLinkFormat({ ...props, setItem, setOpenItem })
              }
            ></DataTypeProvider>
          )}
          <DataTypeProvider
            for={['amount', 'toatlExpenses', 'totalpaid', 'totalinvoiced']}
            formatterComponent={currencyFormatterEmpty}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['due']}
            formatterComponent={dueAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['income']}
            formatterComponent={incomeAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['progress']}
            formatterComponent={progressFormatter}
          ></DataTypeProvider>
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
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
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={services}
          customers={rows}
          tasks={tasks}
        ></PopupCustomerView>
        <PopupCustomerImport
          open={openImport}
          onClose={() => setOpenImport(false)}
          addMultiItems={addMultiCustomers}
          isRTL={isRTL}
          theme={theme}
          words={words}
        ></PopupCustomerImport>
      </Box>
    </PageLayout>
  );
}
