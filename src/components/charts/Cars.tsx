import React from 'react';
import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { carstatuss } from '../../constants';
import ChartHeader from './ChartHeader';

export const useHoverStyles = makeStyles({
  flexGrow: {
    flex: '1',
  },
  button: {
    backgroundColor: '#eee',
    '&:hover': {
      backgroundColor: '#ddd',
    },
  },
});

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
      <Grid item xs={10}>
        <Typography style={{ color, fontWeight: 'bold' }}>{name}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography style={{ color, fontWeight: 'bold' }}>{value}</Typography>
      </Grid>
    </>
  );
};

const Cars = ({ title, data, height, isRTL, prim, retypes, templateId }) => {
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

      const status = getStatus(ty.items, isRTL);
      return {
        ...ty,
        status,
        name: cstat ? (isRTL ? cstat?.nameAr : cstat?.name) : title,
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
                    <Grid item xs={10}>
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
                    <Grid item xs={2}>
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
                      <Grid container spacing={0}>
                        {da?.status?.map((item: any) => renderIte(item))}
                      </Grid>
                    </Grid>
                    <Grid item xs={2}></Grid>
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
                marginTop: 20,
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
                src={imgurl}
                onClick={() => navigate('/manageresourses')}
                width={130}
                height={130}
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

export default Cars;
