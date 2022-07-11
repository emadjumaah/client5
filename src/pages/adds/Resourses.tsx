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
import {
  avatarPatternFormatter,
  colorFormatter,
} from '../../Shared/colorFormat';
import { AlertLocal, SearchTable } from '../../components';
import { errorAlert, errorDeleteAlert } from '../../Shared/helpers';
import PopupResourses from '../../pubups/PopupResourses';
import PageLayout from '../main/PageLayout';
import { getColumns } from '../../common/columns';
import useResoursesDown from '../../hooks/useResoursesDown';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { Typography } from '@material-ui/core';
import useDepartmentsUp from '../../hooks/useDepartmentsUp';

export default function Resourses({ isRTL, words, theme, menuitem }: any) {
  const col = getColumns({ isRTL, words });
  const { departments } = useDepartmentsUp();

  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [columns] = useState([
    { name: isRTL ? 'nameAr' : 'name', title: words.name },
    { name: 'avatar', title: words.color },
    col.carstatus,
    col.department,
    { name: 'info', title: words.info },
  ]);

  const {
    resourses,
    refreshresourses,
    addResourse,
    editResourse,
    removeResourse,
  } = useResoursesDown();
  const { height } = useWindowDimensions();
  const commitChanges = async ({ deleted }) => {
    if (deleted) {
      const _id = deleted[0];
      setLoading(true);
      const res = await removeResourse({ variables: { _id } });
      if (res?.data?.deleteResourse?.ok === false) {
        if (res?.data?.deleteResourse?.error.includes('related')) {
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
      refresh={refreshresourses}
    >
      <Paper>
        {loading && <Loading isRTL={isRTL}></Loading>}
        <Grid rows={resourses} columns={columns} getRowId={getRowId}>
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
          <DataTypeProvider
            for={['avatar']}
            formatterComponent={avatarPatternFormatter}
          ></DataTypeProvider>
          <DataTypeProvider
            for={['color']}
            formatterComponent={colorFormatter}
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
            addAction={addResourse}
            editAction={editResourse}
          >
            <PopupResourses
              departments={departments}
              resType={2}
            ></PopupResourses>
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
