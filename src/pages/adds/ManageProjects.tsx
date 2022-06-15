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
import { Command, errorAlert, Loading, PopupEditing } from '../../Shared';
import { useCustomers, useProducts, useServices } from '../../hooks';
import { getRowId, roles } from '../../common';
import {
  avatarPatternFormatter,
  currencyFormatterEmpty,
  // dueAmountFormatter,
  incomeAmountFormatter,
  totalkaidAmountFormatter,
  nameLinkFormat,
  progressFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useTasks from '../../hooks/useTasks';
import useEmployeesUp from '../../hooks/useEmployeesUp';
import useResoursesUp from '../../hooks/useResoursesUp';
import useProjects from '../../hooks/useProjects';
import PopupProjectView from '../../pubups/PopupProjectView';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';
import PopupProject from '../../pubups/PopupProject';
import { Box, Typography } from '@material-ui/core';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { TableComponent } from '../../Shared/TableComponent';

export default function ManageProjects({
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
  const { employees } = useEmployeesUp();
  const { departments } = useDepartmentsUp();
  const { resourses } = useResoursesUp();
  const { customers } = useCustomers();
  const { services } = useServices();
  const { products } = useProducts();
  const { height } = useWindowDimensions();
  const onCloseItem = () => {
    setOpenItem(false);
    setItem(null);
  };

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
    { name: 'desc', title: words.description },
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
    col.progress,
    col.totalinvoiced,
    col.totalpaid,
    // {
    //   id: 40,
    //   ref: 'due',
    //   name: 'due',
    //   title: isRTL ? 'المتبقي' : 'Due Payment',
    // },
    col.toatlExpenses,
    {
      id: 48,
      ref: 'kids',
      name: 'kids',
      title: isRTL ? 'القيود' : 'Enties',
    },
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
    { name: 'desc', title: words.description },
    { name: 'amount', title: isRTL ? 'الاجمالي' : 'Total' },
    col.progress,
  ]);

  const { projects, refreshproject, addProject, editProject, removeProject } =
    useProjects();

  useEffect(() => {
    if (openItem) {
      if (projects && projects.length > 0) {
        const opened = projects.filter((ts: any) => ts._id === item._id)?.[0];
        setItem(opened);
      }
    }
  }, [projects]);

  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeProject({ variables: { _id } });
      if (res?.data?.deleteProject?.ok === false) {
        if (res?.data?.deleteProject?.error.includes('related')) {
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
      refresh={refreshproject}
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
          rows={projects}
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
            estimatedRowHeight={60}
            tableComponent={TableComponent}
          />

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
          <TableColumnVisibility
            defaultHiddenColumnNames={['avatar', 'depType', 'desc']}
          />
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          {roles.isEditor() && (
            <DataTypeProvider
              for={['nameAr', 'name']}
              formatterComponent={(props: any) =>
                nameLinkFormat({ ...props, setItem, setOpenItem, isRTL })
              }
            ></DataTypeProvider>
          )}
          <DataTypeProvider
            for={['amount', 'toatlExpenses', 'totalpaid', 'totalinvoiced']}
            formatterComponent={currencyFormatterEmpty}
          ></DataTypeProvider>
          {/* <DataTypeProvider
            for={['due']}
            formatterComponent={dueAmountFormatter}
          ></DataTypeProvider> */}
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['income']}
            formatterComponent={incomeAmountFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['kids']}
            formatterComponent={totalkaidAmountFormatter}
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
            addAction={addProject}
            editAction={editProject}
          >
            <PopupProject
              employees={employees}
              departments={departments}
              resourses={resourses}
              customers={customers}
            ></PopupProject>
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
        <PopupProjectView
          open={openItem}
          onClose={onCloseItem}
          row={item}
          isNew={false}
          addAction={addProject}
          editAction={editProject}
          theme={theme}
          projects={projects}
          departments={departments}
          company={company}
          resourses={resourses}
          employees={employees}
          servicesproducts={services}
          products={products}
          customers={customers}
          tasks={tasks}
        ></PopupProjectView>
      </Box>
    </PageLayout>
  );
}
