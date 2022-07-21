import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import MyIcon from '../../Shared/MyIcon';

const Invcs = ({ title, icon, height, prim, onOpen }) => {
  return (
    <Paper elevation={2} style={{ height }}>
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
          onClick={onOpen}
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
            marginTop: 35,
          }}
        >
          <MyIcon size={90} color={prim} icon={icon}></MyIcon>
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
            style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Invcs;
