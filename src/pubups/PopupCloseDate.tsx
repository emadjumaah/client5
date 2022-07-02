/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Grid,
  Typography,
  Checkbox,
  colors,
  Divider,
} from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import { CalenderLocal } from '../components';
import { getDateDayTimeFormat } from '../Shared/colorFormat';

const PopupCloseDate = ({
  open,
  onClose,
  theme,
  isRTL,
  toCloseTask,
  title,
  minDate,
  maxDate,
  del,
  setDel,
  tasktype,
}: any) => {
  const [time, setTime] = useState<any>(new Date());
  const [view, setView] = useState<any>(false);

  const onFormClose = () => {
    setTime(new Date());
    setView(false);
    onClose();
  };

  const onSubmit = async () => {
    await toCloseTask(time);
    onFormClose();
  };

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onFormClose}
      title={title}
      onSubmit={onSubmit}
      theme={theme}
      alrt={{}}
      savetitle={isRTL ? 'متابعة' : 'Proceed'}
      maxWidth="xl"
    >
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box
            display="flex"
            style={{
              backgroundColor: '#fff',
              // direction: 'ltr',
              minWidth: 400,
              // alignItems: 'center',
              // justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}
            >
              {getDateDayTimeFormat(time, isRTL)}
            </Typography>
            <Box style={{ height: 20 }}></Box>
            {tasktype === 2 && (
              <FormControlLabel
                control={
                  <Checkbox
                    style={{ padding: 7 }}
                    checked={del}
                    onChange={() => setDel(!del)}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    style={{ color: colors.blue[700] }}
                    variant="subtitle2"
                  >
                    {isRTL
                      ? 'حذف المواعيد الزائدة'
                      : 'Delete Extra Appointments'}
                  </Typography>
                }
                style={{ fontSize: 14 }}
              />
            )}
            <Box style={{ height: 20 }}></Box>
            <Divider></Divider>
            <Box style={{ height: 20 }}></Box>
            <Box display={'flex'}>
              <Box style={{ width: 160, marginTop: 15 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      style={{ padding: 7 }}
                      checked={view}
                      onChange={() => setView(!view)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography
                      style={{ color: colors.blue[700] }}
                      variant="subtitle2"
                    >
                      {isRTL ? 'تحديد وقت الاقفال' : 'Custom Close Time'}
                    </Typography>
                  }
                  style={{ fontSize: 14 }}
                />
              </Box>

              <CalenderLocal
                isRTL={isRTL}
                label={isRTL ? ' قت الاقفال' : 'Close Time'}
                value={time}
                onChange={setTime}
                format="dd/MM/yyyy - hh:mm"
                time
                disabled={!view}
                width={160}
                minDate={minDate}
                maxDate={maxDate}
              ></CalenderLocal>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};
export default PopupCloseDate;
