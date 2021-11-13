import * as React from 'react';
import { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import MyIcon from '../Shared/MyIcon';
export default function Maps({ onClick, location, width, height }) {
  const [viewport, setViewport] = useState({
    width,
    height,
    latitude: location?.lat ?? 25.247243,
    longitude: location?.lng ?? 51.453265,
    zoom: 13,
  });

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
      mapboxApiAccessToken={
        'pk.eyJ1IjoiamFkd2FsIiwiYSI6ImNrdnZ0ZGlidzAxcmYycGxjdHcxbm13NDAifQ.xDH1jt5iI2NCPPOHtBwuBg'
      }
      mapStyle="mapbox://styles/jadwal/ckvx3yscv05uw14nxzjjv8qf4"
      onClick={({ lngLat }) => {
        const lat = lngLat[1];
        const lng = lngLat[0];
        onClick({ lat, lng });
      }}
    >
      {location?.lat && (
        <Marker latitude={location?.lat} longitude={location?.lng}>
          <div
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <MyIcon size={45} color="red" icon="location"></MyIcon>
          </div>
        </Marker>
      )}
    </ReactMapGL>
  );
}
