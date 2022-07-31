import { Box, Typography } from '@material-ui/core';
import { appversion } from '../constants';

function LandingFooter() {
  return (
    <Box
      style={{
        minHeight: 500,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'ltr',
      }}
    >
      <Typography component="span" style={{ fontSize: 50, color: '#bbb' }}>
        JADWAL.IO
      </Typography>{' '}
      <Typography
        component="span"
        style={{
          fontSize: 16,
          color: '#bbb',
          marginLeft: 20,
          marginRight: 20,
          marginTop: 25,
        }}
      >
        Version {appversion}
      </Typography>
    </Box>
  );
}

export default LandingFooter;
