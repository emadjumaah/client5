/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
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
import { useCustomers } from '../../hooks';
import { getRowId } from '../../common';
import {
  avatarPatternFormatter,
  currencyFormatterEmpty,
  dueAmountFormatter,
  incomeAmountFormatter,
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

export default function ManageProjects({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
  company,
  servicesproducts,
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
      isEditor={isEditor}
      theme={theme}
      refresh={refreshproject}
    >
      <Paper>
        {loading && <Loading isRTL={isRTL}></Loading>}

        <Grid rows={projects} columns={columns} getRowId={getRowId}>
          <SortingState />
          <SearchState />
          <EditingState onCommitChanges={commitChanges} />

          <IntegratedSorting />
          <IntegratedFiltering />

          <VirtualTable
            height={window.innerHeight - 133}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
          />

          <TableHeaderRow showSortingControls />
          <TableColumnVisibility
            defaultHiddenColumnNames={['avatar', 'depType', 'desc']}
          />
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['nameAr', 'name']}
            formatterComponent={(props: any) =>
              nameLinkFormat({ ...props, setItem, setOpenItem })
            }
          ></DataTypeProvider>
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
            addAction={addProject}
            editAction={editProject}
          >
            <PopupProject></PopupProject>
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
          isEditor={isEditor}
          projects={projects}
          departments={departments}
          company={company}
          resourses={resourses}
          employees={employees}
          servicesproducts={servicesproducts}
          customers={customers}
          tasks={tasks}
        ></PopupProjectView>
      </Paper>
    </PageLayout>
  );
}
