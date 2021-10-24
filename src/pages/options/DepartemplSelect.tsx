/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, fade, Grid, IconButton, Typography } from '@material-ui/core';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

const DepartemplSelect = ({
  value,
  setValue,
  isRTL,
  count,
  theme,
  refresh,
  noEmpl,
}: any) => {
  const onchange = (e: any) => {
    setValue(e.target.value);
  };
  return (
    <Box m={1}>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <RadioGroup
            aria-label="Views"
            name="views"
            row
            value={value}
            onChange={onchange}
          >
            {!noEmpl && (
              <FormControlLabel
                value="employeeId"
                control={<Radio color="primary" />}
                label={isRTL ? 'الموظف' : 'Employee'}
              />
            )}
            <FormControlLabel
              value="departmentId"
              control={<Radio color="primary" />}
              label={isRTL ? 'القسم' : 'Department'}
            />
            <FormControlLabel
              value="status"
              control={<Radio color="primary" />}
              label={isRTL ? 'الحالة' : 'Status'}
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={3}>
          {count > 0 && (
            <Box display="flex">
              <Typography
                style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
              >
                {isRTL ? 'المواعيد: ' : 'Appointments: '}
              </Typography>
              <Typography
                style={{
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                  fontWeight: 'bold',
                }}
              >
                {count}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={2}>
          <Box
            display="flex"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {refresh && (
              <IconButton
                style={{
                  backgroundColor: fade(theme.palette.secondary.main, 0.5),
                  padding: 7,
                }}
                onClick={refresh}
              >
                <RefreshOutlinedIcon
                  style={{ fontSize: 24 }}
                  color="primary"
                ></RefreshOutlinedIcon>
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartemplSelect;
