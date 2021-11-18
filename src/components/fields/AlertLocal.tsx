/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export default function AlertLocal({ type, msg, isRTL, top, w }: any) {
  const { width } = useWindowDimensions();

  return (
    <Alert
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        position: 'absolute',
        zIndex: 111,
        bottom: top ? undefined : 60,
        top: top ? 55 : undefined,
        width: top && !w ? width - 275 : width - 50,
        height: top ? 60 : undefined,
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
      }}
      severity={type}
    >
      {msg}
    </Alert>
  );
}
