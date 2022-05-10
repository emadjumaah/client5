/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Grid,
  Typography,
  Checkbox,
  colors,
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
              direction: 'ltr',
              minWidth: 400,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 40 }}
            >
              {getDateDayTimeFormat(time, isRTL)}
            </Typography>
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
                  {isRTL ? 'تفعيل الوقت' : 'Activate Date'}
                </Typography>
              }
              style={{ fontSize: 14 }}
            />

            <CalenderLocal
              isRTL={isRTL}
              label={isRTL ? 'توقيت الاقفال' : 'Close Time'}
              value={time}
              onChange={setTime}
              format="dd/MM/yyyy - hh:mm"
              time
              disabled={!view}
              width={250}
              minDate={minDate}
              maxDate={maxDate}
            ></CalenderLocal>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};
export default PopupCloseDate;
