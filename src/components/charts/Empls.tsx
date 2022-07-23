import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import ChartHeader from './ChartHeader';
import { useHoverStyles } from './Cars';

const Empls = ({ title, data, height, isRTL, prim, retypes }) => {
  const classes = useHoverStyles();
  let navigate = useNavigate();

  let data02: any;
  if (data && data.length > 0) {
    const types = _(data)
      .groupBy('retypeId')
      .map((array, key) => ({
        name: key,
        value: array.length,
        items:
          key === 'null'
            ? data.filter((d: any) => !d.retypeId)
            : data.filter((d: any) => d.retypeId === key),
      }))
      .value();

    const rda = types.map((ty: any) => {
      const cstat = retypes.filter((cs: any) => cs._id === ty.name)?.[0];
      return {
        ...ty,
        name: cstat ? (isRTL ? cstat?.nameAr : cstat?.name) : title,
      };
    });
    data02 = rda;
  }
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <Paper
        style={{
          flex: 1,
          height: height - 50,
          overflow: 'auto',
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={7}>
            <Grid
              container
              spacing={0}
              style={{ marginTop: 15, paddingRight: 15 }}
            >
              {(data02 || []).map((da: any) => {
                return (
                  <>
                    <Grid item xs={8}>
                      <Typography
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                          padding: 10,
                        }}
                      >
                        {da?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                          padding: 10,
                        }}
                      >
                        {da?.value}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 5 }}>
                      <Divider></Divider>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
          <Grid
            item
            xs={5}
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -15,
            }}
          >
            <Box
              className={classes.button}
              style={{
                marginTop: 40,
                padding: 5,
                overflow: 'hidden',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 150,
                height: 150,
              }}
            >
              <img
                src={
                  'https://res.cloudinary.com/jadwalio/image/upload/v1658345651/employee_qhqamg.png'
                }
                onClick={() => navigate('/manageemployees')}
                width={110}
                height={110}
                style={{ opacity: 0.7 }}
                alt=""
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Paper>
  );
};

export default Empls;
