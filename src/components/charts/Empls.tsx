import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import ChartHeader from './ChartHeader';

const Empls = ({ title, data, height, isRTL, prim, retypes }) => {
  let data02: any;

  let navigate = useNavigate();

  if (data && data.length > 0) {
    const fdata = data.filter((d: any) => d.retypeId);
    const types = _(fdata)
      .groupBy('retypeId')
      .map((array, key) => ({
        name: key,
        value: array.length,
        items: data.filter((d: any) => d.retypeId === key),
      }))
      .value();

    const rda = types.map((ty: any) => {
      const cstat = retypes.filter((cs: any) => cs._id === ty.name)?.[0];
      return {
        ...ty,
        name: isRTL ? cstat?.nameAr : cstat?.name,
      };
    });
    data02 = rda;
  }
  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <Box
        display={'flex'}
        style={{
          flex: 1,
          height: height - 50,
          width: '100%',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Grid container spacing={0} style={{ marginTop: 10 }}>
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
              style={{
                padding: 5,
                overflow: 'hidden',
                objectFit: 'cover',
                cursor: 'pointer',
                backgroundColor: '#eee',
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
                alt=""
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Empls;
