import { Box, Typography } from '@material-ui/core';
import MyIcon from '../Shared/MyIcon';

export default function ImportBtn({ open, isRTL, theme }) {
  return (
    <Box
      display="flex"
      style={{
        position: 'absolute',
        top: 8,
        left: 120,
        flexDirection: 'row',
        width: 100,
        height: 32,
        alignItems: 'center',
        justifyContent: 'space-around',
        cursor: 'pointer',
        backgroundColor: '#fff',
        borderRadius: 5,
      }}
      onClick={open}
    >
      <Typography
        style={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
      >
        {isRTL ? 'استيراد' : 'Import'}
      </Typography>
      <MyIcon
        size={22}
        color={theme.palette.primary.main}
        icon="import"
      ></MyIcon>
    </Box>
  );
}
