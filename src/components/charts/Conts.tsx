import React from 'react';
import {
  Box,
  colors,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import ChartHeader from './ChartHeader';
import { getTaskStatus } from '../../common/helpers';

const getColor = (status: any) => {
  let color;
  let bgcolor;
  if (status === 'مقفل' || status === 'Closed') {
    color = colors.blue[500];
    bgcolor = colors.blue[50];
  }
  if (status === 'لم يبدأ بعد' || status === 'Not Started') {
    color = colors.deepPurple[500];
    bgcolor = colors.deepPurple[50];
  }
  if (status === 'غير مقفل' || status === 'Not Closed') {
    color = colors.orange[500];
    bgcolor = colors.orange[50];
  }
  if (status === 'ساري' || status === 'In Progress') {
    color = colors.green[500];
    bgcolor = colors.green[50];
  }
  return { color, bgcolor };
};

const Conts = ({ title, data, height, isRTL, prim, templateId }) => {
  let data02: any;
  let navigate = useNavigate();
  const rdata = getTaskStatus(data, isRTL);
  if (rdata && rdata.length > 0) {
    const types = _(rdata)
      .groupBy('status')
      .map((array, key) => ({
        name: key,
        value: array.length,
      }))
      .value();
    const rda = types.map((ty: any) => {
      const { color, bgcolor } = getColor(ty?.name);
      return {
        ...ty,
        color,
        bgcolor,
      };
    });
    data02 = rda;
  }
  const imgurl =
    templateId === 9
      ? 'https://res.cloudinary.com/jadwalio/image/upload/v1658365925/driver2_pu699i.png'
      : 'https://res.cloudinary.com/jadwalio/image/upload/v1658365487/caseicon_gzt80l.png';
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
        <Grid container spacing={0}>
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
                src={imgurl}
                onClick={() => navigate('/tasks')}
                width={140}
                height={140}
                alt=""
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Conts;
