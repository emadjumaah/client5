/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import PopupLayout from '../pages/main/PopupLayout';
import MapBox from '../common/MapBox';

const PopupMaps = ({
  open,
  onClose,
  theme,
  isRTL,
  setLocation,
  location,
}: any) => {
  const [marker, setMarker]: any = useState({});

  const onCloseForem = () => {
    setMarker({});
    onClose();
  };

  useEffect(() => {
    if (location) {
      setMarker(location);
    }
  }, [open]);

  const onSubmit = () => {
    if (marker?.lat) {
      setLocation({ lat: marker.lat, lng: marker.lng });
    }
    onCloseForem();
  };
  const onClick = ({ lat, lng }: any) => setMarker({ lat, lng });

  const title = isRTL ? 'الموقع الجغرافي' : 'Map Location';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForem}
      title={title}
      onSubmit={onSubmit}
      theme={theme}
      alrt={{}}
      savetitle={isRTL ? 'متابعة' : 'Proceed'}
      maxWidth="xl"
    >
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Box
            style={{
              backgroundColor: '#fff',
              direction: 'ltr',
            }}
          >
            <MapBox
              onClick={onClick}
              location={marker}
              width="80vh"
              height="50vh"
            ></MapBox>
          </Box>
        </Grid>
      </Grid>
    </PopupLayout>
  );
};
export default PopupMaps;
