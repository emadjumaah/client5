import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import MyIcon from '../../Shared/MyIcon';

const Expns = ({ title, icon, height, prim }) => {
  return (
    <Paper style={{ height }}>
      <Box
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
            marginTop: 50,
          }}
        >
          <MyIcon size={100} color={prim} icon={'import'}></MyIcon>
        </Box>

        <Box
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Expns;
