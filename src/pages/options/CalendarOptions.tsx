/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';

import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { PopupTextField } from '../../Shared';
import { yupResolver } from '@hookform/resolvers/yup';
// import AwsUpload from '../../common/AwsUpload';

const calSchema = yup.object().shape({
  start: yup.number().required().min(0).max(23),
  end: yup.number().required().min(1).max(24),
  duration: yup.number().required().min(15).max(120),
});

const CalendarOptions = ({ words, calendar, setCalendar, isRTL }) => {
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(calSchema),
    defaultValues: {
      start: calendar ? calendar?.start : 8.5,
      end: calendar ? calendar?.end : 21.5,
      duration: calendar ? calendar?.duration : 30,
    },
  });

  const onSubmit = (data: any) => {
    setCalendar({
      start: Number(data.start),
      end: Number(data.end),
      duration: Number(data.duration),
    });
  };

  return (
    <Paper>
      <Box padding={3}>
        <Typography variant="h6">
          {isRTL ? 'تعديل التقويم' : 'Edit Calendar'}
        </Typography>
        <Box
          style={{
            marginTop: 20,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <PopupTextField
                required
                name="start"
                label={words.start}
                register={register}
                errors={errors}
                type="number"
              />
            </Grid>
            <Grid item md={8}></Grid>
            <Grid item xs={12} md={4}>
              <PopupTextField
                required
                name="end"
                label={words.end}
                register={register}
                errors={errors}
                type="number"
              />
            </Grid>
            <Grid item md={8}></Grid>

            <Grid item xs={12} md={4}>
              <PopupTextField
                required
                name="duration"
                label={words.duration}
                register={register}
                errors={errors}
                type="number"
              />
            </Grid>
          </Grid>

          <Box
            display="flex"
            style={{
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: 50,
              // marginTop: 20,
            }}
          >
            <Button
              onClick={handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              style={{
                width: 90,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography>{words.save}</Typography>
            </Button>
          </Box>
        </Box>
        {/* <AwsUpload></AwsUpload> */}
      </Box>
    </Paper>
  );
};

export default CalendarOptions;
