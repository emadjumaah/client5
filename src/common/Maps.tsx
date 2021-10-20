import React from 'react';
import GoogleMapReact from 'google-map-react';
import MyIcon from '../Shared/MyIcon';

const MarkerIcon = (_: any) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <MyIcon size={40} color="#ff80ed" icon="location"></MyIcon>
    </div>
  );
};

const defaultProps = {
  center: {
    lat: 25.288163,
    lng: 51.510501,
  },
  zoom: 11,
};

const Maps = ({ location, width = '15vh', height = '10vh', onClick }: any) => {
  return (
    <div style={{ height, width }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: '' }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onClick={onClick}
        center={location?.lat ? location : defaultProps.center}
      >
        <MarkerIcon lat={location?.lat} lng={location?.lng} />
      </GoogleMapReact>
    </div>
  );
};
export default Maps;
