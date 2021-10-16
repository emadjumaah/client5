/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import {
  Gantt,
  // Task,
  // EventOption,
  // StylingOption,
  ViewMode,
  // DisplayOption,
} from 'gantt-task-react';
import { useEffect, useState } from 'react';
import { ViewSwitcher } from '../pages/calendar/TasksGantt';
import React from 'react';

const PopupGantt = ({ open, onClose, theme, tasks, isRTL }: any) => {
  const [rows, setRows] = useState([]);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = useState(false);

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const newrows = tasks.map((tsk: any) => {
        return {
          ...tsk,
          start: new Date(tsk.start),
          end: new Date(tsk.end),
          name: tsk.title,
        };
      });
      setRows(newrows);
    }
  }, [open]);

  const onCloseForem = () => {
    onClose();
  };

  const title = isRTL ? 'جدول المهمات' : 'Tasks View';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForem}
      title={title}
      onSubmit={() => null}
      theme={theme}
      onlyclose
      alrt={{}}
      maxWidth="xx"
    >
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#fff',
              direction: 'ltr',
            }}
          >
            <ViewSwitcher
              onViewModeChange={(viewMode) => setView(viewMode)}
              onViewListChange={setIsChecked}
              isChecked={isChecked}
              isRTL={isRTL}
              view={view}
            />

            <h2 style={{ textAlign: 'center' }}>
              {isRTL ? 'جدول المهمات' : 'Task View'}
            </h2>
            <Gantt
              tasks={rows}
              viewMode={view}
              locale="ar"
              // onDateChange={handleTaskChange}
              // onDelete={handleTaskDelete}
              // onProgressChange={handleProgressChange}
              // onDoubleClick={handleDblClick}
              // onSelect={handleSelect}
              // onExpanderClick={handleExpanderClick}
              listCellWidth={isChecked ? '155px' : ''}
              ganttHeight={500}
              columnWidth={columnWidth}
              barProgressColor="#58ac58"
              barBackgroundColor="#bbb"
              // barBackgroundSelectedColor="#bbb"
              barProgressSelectedColor="#58ac58"
              todayColor="#d9eed9"
            />
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupGantt;
