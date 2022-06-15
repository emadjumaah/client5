/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  EditingState,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SearchState,
  IntegratedFiltering,
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableHeaderRow,
  TableEditColumn,
  Toolbar,
  SearchPanel,
  TableColumnVisibility,
  ColumnChooser,
  DragDropProvider,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Command, PopupEditing } from '../../Shared';
import { getRowId, roles } from '../../common';
import {
  appointmentsFormatter,
  avataManageFormatter,
  expensesFormatter,
  kaidsFormatter,
  nameManageLinkFormat,
  purchaseFormatter,
  salesFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useTasks from '../../hooks/useTasks';
import {
  useCustomers,
  useProducts,
  useServices,
  useTemplate,
} from '../../hooks';
import PopupResoursesView from '../../pubups/PopupResoursesView';
import PopupResourses from '../../pubups/PopupResourses';
import useResoursesUp from '../../hooks/useResoursesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import { Box, Paper, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';

export default function ManageResourses({
  isRTL,
  words,
  theme,
  menuitem,
  company,
}: any) {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [pageSizes] = useState([5, 10, 20, 50, 0]);
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

  const { tasks } = useTasks();
  const { departments } = useDepartmentsUp();
  const { employees } = useEmployeesUp();
  const { customers } = useCustomers();
  const { services } = useServices();
  const { products } = useProducts();
  const { tempwords } = useTemplate();

  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [columns] = useState([
    { name: 'avatar', title: ' ' },
    col.name,
    col.appointments,
    col.sales,
    col.expenses,
    col.kaids,
    col.purchase,
  ]);

  const [tableColumnExtensions]: any = useState([
    { columnName: 'avatar', width: 60 },
    { columnName: col.name.name, width: 250 },
    { columnName: col.appointments.name, width: 250, align: 'center' },
    { columnName: col.sales.name, width: 200 },
    { columnName: col.expenses.name, width: 200 },
    { columnName: col.kaids.name, width: 200 },
    { columnName: col.purchase.name, width: 200 },
  ]);

  const [columnsViewer] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
  ]);

  const {
    resourses,
    addResourse,
    editResourse,
    removeResourse,
    refreshresourse,
  } = useResoursesUp();
  const { width, height } = useWindowDimensions();
  useEffect(() => {
    if (openItem) {
      if (resourses && resourses.length > 0) {
        const opened = resourses.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [resourses]);
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];

      const res = await removeResourse({ variables: { _id } });
      if (res?.data?.deleteResourse?.ok === false) {
        if (res?.data?.deleteResourse?.error.includes('related')) {
          await errorDeleteAlert(setAlrt, isRTL);
        } else {
          await errorAlert(setAlrt, isRTL);
        }
      }
    }
  };

  return (
    <PageLayout
      menuitem={menuitem}
      isRTL={isRTL}
      words={words}
      theme={theme}
      refresh={refreshresourse}
    >
      <Box
        style={{
          height: height - 50,
          overflow: 'auto',
          backgroundColor: '#fff',
        }}
      >
        <Paper
          elevation={5}
          style={{
            margin: 70,
            marginTop: 70,
            overflow: 'auto',
            width: width - 380,
            borderRadius: 10,
          }}
        >
          <Grid
            rows={resourses}
            columns={roles.isEditor() ? columns : columnsViewer}
            getRowId={getRowId}
          >
            <SortingState />
            <EditingState onCommitChanges={commitChanges} />
            <SearchState />
            <PagingState defaultCurrentPage={0} defaultPageSize={5} />

            <IntegratedSorting />
            <IntegratedFiltering />
            <IntegratedPaging />
            <DragDropProvider />

            <Table
              messages={{
                noData: isRTL ? 'لا يوجد بيانات' : 'no data',
              }}
              tableComponent={TableComponent}
              rowComponent={(props: any) => (
                <Table.Row {...props} style={{ height: 120 }}></Table.Row>
              )}
              columnExtensions={tableColumnExtensions}
            />
            <TableColumnReordering
              defaultOrder={[
                'avatar',
                col.name.name,
                col.appointments.name,
                col.sales.name,
                col.expenses.name,
                col.kaids.name,
                col.purchase.name,
              ]}
            />
            <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />

            <TableHeaderRow
              showSortingControls
              titleComponent={({ children }) => {
                return (
                  <Typography style={{ fontSize: 14, fontWeight: 'bold' }}>
                    {children}
                  </Typography>
                );
              }}
            />
            <TableColumnVisibility defaultHiddenColumnNames={[]} />
            <DataTypeProvider
              for={['avatar']}
              formatterComponent={avataManageFormatter}
            ></DataTypeProvider>
            {roles.isEditor() && (
              <DataTypeProvider
                for={[col.name.name]}
                formatterComponent={(props: any) =>
                  nameManageLinkFormat({
                    ...props,
                    setItem,
                    setOpenItem,
                    isRTL,
                  })
                }
              ></DataTypeProvider>
            )}

            <DataTypeProvider
              for={[col.appointments.name]}
              formatterComponent={(props: any) =>
                appointmentsFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.sales.name]}
              formatterComponent={(props: any) =>
                salesFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.purchase.name]}
              formatterComponent={(props: any) =>
                purchaseFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.expenses.name]}
              formatterComponent={(props: any) =>
                expensesFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>
            <DataTypeProvider
              for={[col.kaids.name]}
              formatterComponent={(props: any) =>
                kaidsFormatter({ ...props, theme, isRTL })
              }
            ></DataTypeProvider>

            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand
              commandComponent={Command}
            ></TableEditColumn>
            <Toolbar />
            <ColumnChooser />
            <PagingPanel pageSizes={pageSizes} />
            <SearchPanel
              inputComponent={(props: any) => {
                return <SearchTable isRTL={isRTL} {...props}></SearchTable>;
              }}
            />
            <PopupEditing
              theme={theme}
              addAction={addResourse}
              editAction={editResourse}
            >
              <PopupResourses resKind={2} resType={1}></PopupResourses>
            </PopupEditing>
          </Grid>
        </Paper>
        {alrt.show && (
          <AlertLocal
            isRTL={isRTL}
            type={alrt?.type}
            msg={alrt?.msg}
            top
          ></AlertLocal>
        )}
        <PopupResoursesView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addResourse}
          editAction={editResourse}
          theme={theme}
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={services}
          products={products}
          customers={customers}
          tasks={tasks}
          tempwords={tempwords}
        ></PopupResoursesView>
      </Box>
    </PageLayout>
  );
}
