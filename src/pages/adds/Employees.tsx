/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
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
} from '@devexpress/dx-react-grid-material-ui';
import { Command, Loading, PopupEditing } from '../../Shared';
import { getRowId } from '../../common';
import { PopupEmployee } from '../../pubups';
import {
  avatarPatternFormatter,
  colorFormatter,
  daysoffFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useEmployeesDown from '../../hooks/useEmployeesDown';
import useDepartmentsDown from '../../hooks/useDepartmentsDown';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function Employees({
  isRTL,
  words,
  isEditor,
  theme,
  menuitem,
}: any) {
  const col = getColumns({ isRTL, words });

  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
    { name: 'phone', title: words.phoneNumber },
    { name: 'email', title: words.email },
    col.department,
    { name: 'info', title: words.info },
    { name: 'daysoff', title: isRTL ? 'يوم العطلة' : 'Day Off' },
  ]);

  const {
    employees,
    addEmployee,
    editEmployee,
    removeEmployee,
    refreshemployee,
  } = useEmployeesDown();
  const { departments } = useDepartmentsDown();
  const { height } = useWindowDimensions();
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
            height={height - 100}
            messages={{
              noData: isRTL ? 'لا يوجد بيانات' : 'no data',
            }}
            estimatedRowHeight={40}
          />
          <TableHeaderRow showSortingControls />
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['color']}
            formatterComponent={colorFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['daysoff']}
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
            <PopupEmployee
              departments={departments}
              resType={2}
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
      </Paper>
    </PageLayout>
  );
}
