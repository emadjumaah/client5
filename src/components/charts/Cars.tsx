import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { carstatuss } from '../../constants';
import ChartHeader from './ChartHeader';

const getStatus = (items: any, isRTL: any) => {
  if (items && items.length > 0) {
    const status = _(items)
      .groupBy('carstatus')
      .map((array, key) => ({
        name: key,
        status: array[0].carstatus,
        value: array.length,
      }))
      .value();
    if (status && status.length > 0) {
      const fdata = status.map((da: any) => {
        const cstat = carstatuss.filter((cs: any) => cs.id === da.status)?.[0];
        if (cstat) {
          return {
            name: isRTL ? cstat?.nameAr : cstat?.name,
            value: da.value,
            color: cstat.color,
          };
        } else {
          return {
            name: isRTL ? carstatuss?.[0]?.nameAr : carstatuss?.[0]?.name,
            value: da.value,
            color: carstatuss?.[0].color,
          };
        }
      });
      return fdata;
    }
  }
};

const renderIte = (item: any) => {
  const { name, value, color } = item;
  return (
    <>
      <Grid item xs={8}>
        <Typography style={{ color, fontWeight: 'bold' }}>{name}</Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography style={{ color, fontWeight: 'bold' }}>{value}</Typography>
      </Grid>
    </>
  );
};

const Cars = ({ title, data, height, isRTL, prim, retypes, templateId }) => {
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

      const status = getStatus(ty.items, isRTL);
      return {
        ...ty,
        status,
        name: isRTL ? cstat?.nameAr : cstat?.name,
      };
    });
    data02 = rda;
  }
  const imgurl =
    templateId === 9
      ? 'https://res.cloudinary.com/jadwalio/image/upload/v1658348315/moto_mbp8ua.png'
      : 'https://res.cloudinary.com/jadwalio/image/upload/v1658365288/caricon_k2zcft.png';
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
            <Grid
              container
              spacing={0}
              style={{ marginTop: 10, paddingRight: 10 }}
            >
              {(data02 || []).map((da: any) => {
                return (
                  <>
                    <Grid item xs={9}>
                      <Typography
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                        }}
                      >
                        {da?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                        }}
                      >
                        {da?.value}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                      <Grid container spacing={1}>
                        {da?.status?.map((item: any) => renderIte(item))}
                      </Grid>
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
                src={imgurl}
                onClick={() => navigate('/manageresourses')}
                width={130}
                height={130}
                alt=""
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Cars;
