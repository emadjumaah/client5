/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, Grid, Typography } from '@material-ui/core';
import { eventStatus } from '../../constants';
import { getCalendarResourses } from '../../common/helpers';
import RefetchBox from '../../Shared/RefetchBox';

const DepartemplSelect = ({
  value,
  setValue,
  isRTL,
  count,
  theme,
  refresh,
  noEmpl,
  employees,
  departments,
  setResourseData,
  loading,
}: any) => {
  const onchange = (e: any) => {
    const val = e.target.value;
    setValue(val);
    let res: any;
    if (val === 'employeeId') {
      res = employees;
    }
    if (val === 'status') {
      res = eventStatus;
    }
    if (val === 'departmentId') {
      res = departments;
    }
    const resourses = getCalendarResourses(res, val, 'Data');
    setResourseData(resourses);
  };

  useEffect(() => {
    if (!value && departments && departments.length > 0) {
      const resourses = getCalendarResourses(
        departments,
        'departmentId',
        'Data'
      );
      setValue('departmentId');
      setResourseData(resourses);
    }
  }, [departments]);

  return (
    <Box m={1}>
      <Grid container spacing={1}>
        <Grid item xs={9}>
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
        <Grid item xs={2}>
          {count > 0 && (
            <Box display="flex">
              {/* <Typography
                style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
              >
                {isRTL ? 'المواعيد: ' : 'Appointments: '}
              </Typography> */}
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
        <Grid item xs={1}>
          <Box
            display="flex"
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {refresh && (
              <RefetchBox
                isRTL={isRTL}
                theme={theme}
                refresh={refresh}
                loading={loading}
              ></RefetchBox>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepartemplSelect;
