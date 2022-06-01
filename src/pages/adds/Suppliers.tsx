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
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { useProducts } from '../../hooks';
import { getRowId, roles } from '../../common';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupSupplier from '../../pubups/PopupSupplier';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useTasks from '../../hooks/useTasks';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import { getColumns } from '../../common/columns';
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '../../graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Box } from '@material-ui/core';
import PageLayout from '../main/PageLayout';
import { TableComponent } from '../../Shared/TableComponent';
import {
  currencyFormatterEmpty,
  incomeAmountFormatter,
  nameLinkFormat,
} from '../../Shared/colorFormat';
import PopupSupplierView from '../../pubups/PopupSupplierView';

export default function Suppliers(props: any) {
  const { isRTL, words, menuitem, theme, company } = props;
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [rows, setRows] = useState([]);
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const { height } = useWindowDimensions();
  const { tasks } = useTasks();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { resourses } = useResoursesUp();
  const { products } = useProducts();

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

  const [loadSuppls, supplsData]: any = useLazyQuery(getSuppliers, {
    fetchPolicy: 'cache-and-network',
  });

  const refresQuery = {
    refetchQueries: [
      {
        query: getSuppliers,
        variables: { isRTL },
      },
    ],
  };

  useEffect(() => {
    if (openItem) {
      const tsks = supplsData?.data?.['getSuppliers']?.data || [];
      if (tsks && tsks.length > 0) {
        const opened = tsks.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [supplsData]);

  useEffect(() => {
    loadSuppls({ isRTL });
  }, []);

  const [addSupplier] = useMutation(createSupplier, refresQuery);
  // const [addMultiSuppliers] = useMutation(createMultiSuppliers, refresQuery);
  const [editSupplier] = useMutation(updateSupplier, refresQuery);
  const [removeSupplier] = useMutation(deleteSupplier, refresQuery);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      const res = await removeSupplier({ variables: { _id } });
      if (res?.data?.deleteSupplier?.ok === false) {
        if (res?.data?.deleteSupplier?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  useEffect(() => {
    if (supplsData?.data?.getSuppliers?.data) {
      const { data } = supplsData.data.getSuppliers;
      setRows(data);
    }
  }, [supplsData]);

  const refresh = () => {
    supplsData?.refetch();
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
            for={['income']}
            formatterComponent={incomeAmountFormatter}
          ></DataTypeProvider>
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            showAddCommand
            commandComponent={Command}
          ></TableEditColumn>
          <Toolbar />
          <SearchPanel
            inputComponent={(props: any) => {
              return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
            }}
          />
          <PopupEditing
            theme={theme}
            addAction={addSupplier}
            editAction={editSupplier}
          >
            <PopupSupplier></PopupSupplier>
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
        <PopupSupplierView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addSupplier}
          editAction={editSupplier}
          theme={theme}
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={products}
          customers={rows}
          tasks={tasks}
        ></PopupSupplierView>
      </Box>
    </PageLayout>
  );
}
