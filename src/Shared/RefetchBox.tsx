import { CircularProgress, fade, IconButton, Tooltip } from '@material-ui/core';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';

function RefetchBox({ isRTL, theme, refresh, loading }: any) {
  return (
    <Tooltip title={isRTL ? 'تحديث' : 'Refresh'}>
      <IconButton
        style={{
          backgroundColor: fade(theme.palette.primary.light, 0.5),
          padding: 7,
        }}
        onClick={refresh}
      >
        {!loading && (
          <RefreshOutlinedIcon
            style={{ fontSize: 24, color: '#f5f5f5' }}
            color="primary"
          ></RefreshOutlinedIcon>
        )}
        {loading && <CircularProgress style={{ color: '#f5f5f5' }} size={24} />}
      </IconButton>
    </Tooltip>
  );
}

export default RefetchBox;
