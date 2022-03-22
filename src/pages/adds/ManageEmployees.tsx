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
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupEmployee } from '../../pubups';
import {
  avatarPatternFormatter,
  currencyFormatterEmpty,
  daysoffFormatter,
  dueAmountFormatter,
  incomeAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import PopupEmployeeView from '../../pubups/PopupEmployeeView';
import useTasks from '../../hooks/useTasks';
import { useCustomers, useServices } from '../../hooks';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import { Box } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';
import { roles } from '../../common';

export default function ManageEmployees({
  isRTL,
  words,
  theme,
  menuitem,
  company,
}: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [item, setItem] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const col = getColumns({ isRTL, words });

  const { tasks } = useTasks();
  const { customers } = useCustomers();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();
  const { services } = useServices();
  const { height } = useWindowDimensions();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    {
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: words.department,
    },
    { name: 'info', title: words.info },
    { name: 'daysoff', title: isRTL ? 'يوم العطلة' : 'Day Off' },
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
    { name: 'avatar', title: words.color },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    {
      name: isRTL ? 'departmentNameAr' : 'departmentName',
      title: words.department,
    },
    { name: 'info', title: words.info },
    { name: 'daysoff', title: isRTL ? 'يوم العطلة' : 'Day Off' },
  ]);

  const {
    employees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refreshemployee,
  } = useEmployeesUp();

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
        if (res?.data?.deleteEmployee?.error.includes('related')) {
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
      theme={theme}
      refresh={refreshemployee}
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
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid
          rows={employees.filter((em: any) => em.resType === 1)}
          columns={roles.isAdmin() ? columns : columnsViewer}
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
              'info',
              'daysoff',
              'amount',
              'progress',
              'totalinvoiced',
              'totalpaid',
              'due',
              'toatlExpenses',
              'income',
            ]}
          />

          <DataTypeProvider
            for={['daysoff']}
            formatterComponent={(props: any) =>
              daysoffFormatter({ ...props, isRTL })
            }
          ></DataTypeProvider>
          {roles.isAdmin() && (
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
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
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
            addAction={addEmployee}
            editAction={editEmployee}
          >
            <PopupEmployee
              departments={departments}
              resType={1}
            ></PopupEmployee>
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
          departments={departments}
          company={company}
          employees={employees}
          resourses={resourses}
          servicesproducts={services}
          customers={customers}
          tasks={tasks}
        ></PopupEmployeeView>
      </Box>
    </PageLayout>
  );
}
